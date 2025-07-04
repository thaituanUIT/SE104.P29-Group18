// src/services/interviewService.js
/*eslint-disable*/
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { interviewModel } from '~/models/interviewRoundModel.js';
import { applyModel } from '~/models/applyModel'; // To update applicant phase/status
import { jobModel } from '~/models/jobModel'; // To get job details for email
import { userModel } from '~/models/userModel'; // To get applicant details for email
import { BrevoProvider } from '~/providers/BrevoProvider'; // For sending emails

// Email Templates (same as before)
const emailTemplates = {
    interviewInvitation: (applicantName, jobTitle, date, type, location) => `
      <div style="
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c3e50;
        line-height: 1.6;
      ">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/sonpham811205/image/upload/v1743226032/Pink_Cartoon_Toy_Store_Logo_1_jfngiu-removebg-preview_utidiz.png" alt="IT_Jobs Logo" style="max-width: 80px;">
        </div>
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Thư mời phỏng vấn</h2>
        <p>Kính gửi <strong>${applicantName}</strong>,</p>
        <p>Chúng tôi xin mời bạn tham gia buổi phỏng vấn cho vị trí <strong>${jobTitle}</strong>.</p>
        <p><strong>Thời gian:</strong> ${date}</p>
        <p><strong>Hình thức:</strong> ${type}</p>
        <p>${type === 'Online' ? '<strong>Link:</strong> ' + location : '<strong>Địa điểm:</strong> ' + location}</p>
        <p>Vui lòng xác nhận tham gia bằng cách trả lời email này.</p>
        <p>Trân trọng,</p>
        <p><strong>Phòng Nhân sự</strong></p>
      </div>
    `,
    interviewRejection: (applicantName, jobTitle) => `
      <div style="
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c3e50;
        line-height: 1.6;
      ">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/sonpham811205/image/upload/v1743226032/Pink_Cartoon_Toy_Store_Logo_1_jfngiu-removebg-preview_utidiz.png" alt="IT_Jobs Logo" style="max-width: 80px;">
        </div>
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Thông báo kết quả phỏng vấn</h2>
        <p>Kính gửi <strong>${applicantName}</strong>,</p>
        <p>Cảm ơn bạn đã tham gia buổi phỏng vấn cho vị trí <strong>${jobTitle}</strong>.</p>
        <p>Sau khi cân nhắc kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn chưa phù hợp với vị trí này tại thời điểm hiện tại.</p>
        <p>Chúng tôi đánh giá cao sự quan tâm của bạn và khuyến khích bạn tiếp tục theo dõi các cơ hội khác tại công ty chúng tôi trong tương lai.</p>
        <p>Trân trọng,</p>
        <p><strong>Phòng Nhân sự</strong></p>
      </div>
    `,
    nextRoundInvitation: (applicantName, jobTitle, roundName) => `
      <div style="
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c3e50;
        line-height: 1.6;
      ">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/sonpham811205/image/upload/v1743226032/Pink_Cartoon_Toy_Store_Logo_1_jfngiu-removebg-preview_utidiz.png" alt="IT_Jobs Logo" style="max-width: 80px;">
        </div>
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Thư mời tham gia vòng phỏng vấn tiếp theo</h2>
        <p>Kính gửi <strong>${applicantName}</strong>,</p>
        <p>Chúc mừng! Bạn đã vượt qua vòng phỏng vấn trước đó cho vị trí <strong>${jobTitle}</strong>.</p>
        <p>Chúng tôi muốn mời bạn tham gia <strong>${roundName}</strong>.</p>
        <p>Chúng tôi sẽ liên hệ với bạn sớm để sắp xếp lịch phỏng vấn.</p>
        <p>Trân trọng,</p>
        <p><strong>Phòng Nhân sự</strong></p>
      </div>
    `
};

const createInterview = async (interviewData) => {
    try {
        const { jobId, applicantId, roundId } = interviewData;

        // Check if an interview for this applicant in this round already exists
        const existingInterview = await interviewModel.findByJobIdAndApplicantIdAndRoundId(jobId, applicantId, roundId);
        if (existingInterview) {
            throw new ApiError(StatusCodes.CONFLICT, 'Lịch phỏng vấn cho ứng viên này ở vòng này đã tồn tại.');
        }

        const newInterview = await interviewModel.createNew(interviewData);

        // Update applicant's status in applyModel
        await applyModel.update(applicantId, { status: 'Đã xác nhận', currentOverallStatus: 'Đang đánh giá' }); // Update both apply.status and apply.currentOverallStatus

        return newInterview;
    } catch (error) {
        throw error;
    }
};

const updateInterview = async (interviewId, updateData) => {
    try {
        const interview = await interviewModel.findOneById(interviewId);
        if (!interview) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Lịch phỏng vấn không tồn tại.');
        }

        const updatedInterview = await interviewModel.update(interviewId, updateData);

        // If interview is explicitly cancelled or completed, update applicant's application status
        if (updateData.status === 'Đã hủy') {
            await applyModel.update(interview.applicantId.toString(), { status: 'Đã hủy', currentOverallStatus: 'Đang đánh giá' }); // Applicant is still in interview phase, just this specific interview cancelled
        } else if (updateData.status === 'Đã hoàn thành') {
             // If evaluation is not yet set but interview is marked complete, keep applicant overall status as 'Đang đánh giá'
             await applyModel.update(interview.applicantId.toString(), { status: 'Đã hoàn thành', currentOverallStatus: 'Đang đánh giá' });
        }


        return updatedInterview;
    }
    catch (error) {
        throw error;
    }
};

const evaluateInterview = async (interviewId, evaluationData) => {
    try {
        const interview = await interviewModel.findOneById(interviewId);
        if (!interview) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Lịch phỏng vấn không tồn tại.');
        }

        // Update interview status to 'Đã hoàn thành' and add evaluation
        const updatedInterview = await interviewModel.update(interviewId, {
            status: 'Đã hoàn thành',
            evaluation: evaluationData
        });

        // Get applicant and job details for follow-up
        const applicant = await applyModel.findOneById(interview.applicantId.toString());
        const job = await jobModel.findOneById(interview.jobId.toString());

        if (!applicant || !job) {
            console.error('Applicant or job not found for follow-up after evaluation.');
            return updatedInterview;
        }

        // Determine next steps based on evaluation result
        if (evaluationData.result === 'Đạt') {
            const currentRoundOrder = job.interviewRounds.find(r => r.id === interview.roundId)?.order;
            const sortedRounds = job.interviewRounds.sort((a, b) => a.order - b.order);
            const nextRoundIndex = sortedRounds.findIndex(r => r.id === interview.roundId) + 1;
            const nextRound = sortedRounds[nextRoundIndex];

            if (nextRound) {
                // Update applicant's currentRound and overall status
                await applyModel.update(applicant._id.toString(), {
                    currentRound: nextRound.id,
                    currentOverallStatus: 'Đang đánh giá' // Still in process
                });
                BrevoProvider.sendEmail(applicant.email, 'Thư mời tham gia vòng phỏng vấn tiếp theo', emailTemplates.nextRoundInvitation(applicant.fullName || applicant.email, job.title, nextRound.name));
            } else {
                // Applicant passed all rounds
                await applyModel.update(applicant._id.toString(), {
                    currentOverallStatus: 'Đạt', // Final status
                    phase: 'end'
                });
                // Potentially send a final acceptance email
                // BrevoProvider.sendEmail(applicant.email, 'Chúc mừng trúng tuyển!', emailTemplates.finalAcceptance(applicant.fullName, job.title));
            }
        } else {
            // Applicant failed the interview
            await applyModel.update(applicant._id.toString(), {
                currentOverallStatus: 'Không đạt', // Final status
                phase: 'end'
            });
            BrevoProvider.sendEmail(applicant.email, 'Thông báo kết quả phỏng vấn', emailTemplates.interviewRejection(applicant.fullName || applicant.email, job.title));
        }

        return updatedInterview;
    } catch (error) {
        throw error;
    }
};

const deleteInterview = async (interviewId) => {
    try {
        const interview = await interviewModel.findOneById(interviewId);
        if (!interview) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Lịch phỏng vấn không tồn tại.');
        }
        // Mark as destroyed and set status to 'Đã hủy'
        const result = await interviewModel.update(interviewId, { _destroy: true, status: 'Đã hủy' });

        // Optionally, reset applicant's specific round progress in applyModel if you track it there.
        // For now, we'll assume the frontend will handle resetting its internal state for that round.
        // Example: If an interview is deleted, and it was the current round, maybe reset applicant.currentRound
        // or set applicant.currentOverallStatus back to 'Đang đánh giá' if it was final and is now invalidated.
        // This logic needs careful consideration based on exact business rules for deletion.
        return result;
    } catch (error) {
        throw error;
    }
};

const sendInterviewInvitation = async (interviewId) => {
    try {
        const interview = await interviewModel.findOneById(interviewId);
        if (!interview) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Lịch phỏng vấn không tồn tại.');
        }

        const applicant = await applyModel.findOneById(interview.applicantId.toString());
        const job = await jobModel.findOneById(interview.jobId.toString());

        if (!applicant || !job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy ứng viên hoặc thông tin công việc.');
        }

        const formattedDate = new Date(interview.date).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
        const location = interview.type === 'Online' ? interview.link : interview.location;

        BrevoProvider.sendEmail(applicant.email, `Lời mời phỏng vấn cho vị trí ${job.title}`, emailTemplates.interviewInvitation(
            applicant.fullName || applicant.email, job.title, formattedDate, interview.type, location
        ));

        // Update interview status to 'Đã xác nhận' after sending invitation
        const updatedInterview = await interviewModel.update(interviewId, { status: 'Đã xác nhận' });

        return updatedInterview;
    } catch (error) {
        throw error;
    }
};

const getInterviewsByJobId = async (jobId) => {
    try {
        const interviews = await interviewModel.findByJobId(jobId);
        return interviews;
    } catch (error) {
        throw error;
    }
};

const getInterviewsByApplicantId = async (applicantId) => {
    try {
        const interviews = await interviewModel.findByApplicantId(applicantId);
        return interviews;
    } catch (error) {
        throw error;
    }
};

// NEW: Get all interviews by employer ID (for frontend dashboard view)
const getInterviewsByEmployerId = async (employerId) => {
    try {
        // First, find all jobs associated with this employer
        const jobs = await jobModel.findByEmployerId(employerId);
        if (!jobs || jobs.length === 0) return [];

        const jobIds = jobs.map(job => job._id.toString());

        // Then, find all interviews for these job IDs
        const allInterviews = await Promise.all(jobIds.map(jobId => interviewModel.findByJobId(jobId)));

        // Flatten the array of arrays of interviews
        return [].concat(...allInterviews);

    } catch (error) {
        throw new Error(`Error fetching interviews by employer ID: ${error.message}`);
    }
};


export const interviewService = {
    createInterview,
    updateInterview,
    evaluateInterview,
    deleteInterview,
    sendInterviewInvitation,
    getInterviewsByJobId,
    getInterviewsByApplicantId,
    getInterviewsByEmployerId // New export
};