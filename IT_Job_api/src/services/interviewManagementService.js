import { interviewRoundModel } from '~/models/interviewRoundModel.js'
import { interviewModel } from '~/models/interviewModel'
import { interviewApplicantProgressModel } from '~/models/interviewApplicantProgressModel'
import { applyModel } from '~/models/applyModel'
import { jobModel } from '~/models/jobModel'
import { userModel } from '~/models/userModel'
import { BrevoProvider } from '~/providers/BrevoProvider'
import ApiError from '~/utils/ApiError'
import { ObjectId } from 'mongodb'
import { StatusCodes } from 'http-status-codes'

// Email templates for interview notifications
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
            <p><strong>${type === 'Online' ? 'Link' : 'Địa điểm'}:</strong> ${location}</p>

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

            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Thông báo kết quả phỏng vấn</h2>

            <p>Kính gửi <strong>${applicantName}</strong>,</p>


            <p>Chúng tôi chúc mừng bạn đã vượt qua <strong>${roundName}</strong>.</p>

            <p>Chúng tôi sẽ liên hệ với bạn sớm để sắp xếp lịch phỏng vấn tiếp theo.</p>

            <p>Trân trọng,</p>
            <p><strong>Phòng Nhân sự</strong></p>
        </div>
    `,
    interviewLocationChange: (applicantName, jobTitle, date, type, location) => `
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

        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Thông báo thay đổi địa điểm phỏng vấn</h2>

        <p>Kính gửi <strong>${applicantName}</strong>,</p>

        <p>Chúng tôi xin thông báo có sự điều chỉnh liên quan đến buổi phỏng vấn vị trí <strong>${jobTitle}</strong> mà bạn đã được mời tham dự.</p>

      
        <p><strong>Thời gian:</strong> ${date}</p>
        <p><strong>Hình thức:</strong> ${type}</p>
        <p><strong>${type === 'Online' ? 'Link' : 'Địa điểm'}:</strong> ${location}</p>

        <p>Chúng tôi thành thật xin lỗi vì sự bất tiện này và rất mong bạn thông cảm. Vui lòng xác nhận lại việc tham gia phỏng vấn tại địa điểm mới bằng cách trả lời email này.</p>

        <p>Trân trọng,</p>
        <p><strong>Phòng Nhân sự</strong></p>
    </div>
`
}

// Get all jobs with interview rounds
const getJobsWithInterviewRounds = async (employerId) => {
    try {
        // Get all jobs for this employer
        const jobs = await jobModel.findByEmployerId(employerId)

        if (!jobs || jobs.length === 0) {
            return []
        }

        // Get interview rounds for each job
        const jobsWithRounds = await Promise.all(jobs.map(async (job) => {
            const interviewRounds = await interviewRoundModel.findByJobId(job._id.toString())

            // Get applicants for this job
            const applicants = await applyModel.findByJobId(job._id.toString())

            return {
                ...job,
                interviewRounds: interviewRounds || [],
                applicantsCount: applicants.length
            }
        }))

        return jobsWithRounds
    } catch (error) {
        throw new Error(`Error getting jobs with interview rounds: ${error.message}`)
    }
}

// Get qualified applicants for a job
const getQualifiedApplicants = async (jobId) => {
    try {
        // Get all applications for this job
        const applications = await applyModel.findByJobId(jobId)
        if (!applications || applications.length === 0) {
            return []
        }
        // Get job details
        const job = await jobModel.findOneById(jobId)
        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found')
        }
        // Get interview rounds for this job
        const interviewRounds = await interviewRoundModel.findByJobId(jobId)
        
        // Get applicant progress records
        const progressRecords = await interviewApplicantProgressModel.findByJobId(jobId)
        
        // Create a map for quick lookup
        const progressMap = {}
        progressRecords.forEach(record => {
            progressMap[record.applicantId.toString()] = record
        })
        
        // Get applicant details
        const qualifiedApplicants = await Promise.all(applications.map(async (app) => {
            // Get user profile
            const userProfile = await userModel.findOneByEmail(app.email)
            // Get or create progress record
            let progress = progressMap[app._id.toString()]
            if (!progress) {
                // Create initial progress record if it doesn't exist
                const initialProgress = {
                    applicantId: app._id.toString(),
                    jobId: jobId,
                    currentRound: interviewRounds.length > 0 ? interviewRounds[0]._id : null,
                    currentOverallStatus: 'Đang đánh giá',
                    interviewProgress: interviewRounds.map(round => ({
                        roundId: round._id,
                        status: null,
                        result: null
                    })),
                    skills: [],
                    overallNotes: ''
                }

                const newProgress = await interviewApplicantProgressModel.createNew(initialProgress)

                progress = {
                    ...initialProgress,
                    _id: newProgress.insertedId
                }
            }

            // Get interviews for this applicant
            // const interviews = await interviewModel.findByApplicantId(app._id.toString())

            return {
                id: app._id.toString(),
                jobId: app.jobId.toString(),
                name: app.fullName || userProfile?.name || '',
                email: app.email,
                phone: app.phoneNumber || userProfile?.phone || '',
                appliedDate: app.createdAt,
                tests: app.tests || [],
                currentOverallStatus: progress.currentOverallStatus,
                currentRound: progress.currentRound,
                interviewProgress: progress.interviewProgress,
                skills: progress.skills,
                education: userProfile?.education || [],
                experience: userProfile?.experience || [],
                overallNotes: progress.overallNotes
            }
        }))

        return qualifiedApplicants
    } catch (error) {
        throw new Error(`Error getting qualified applicants: ${error.message}`)
    }
}

// Get all interviews for a job
const getInterviewsByJobId = async (jobId) => {
    try {
        const interviews = await interviewModel.findByJobId(jobId)

        return interviews
    } catch (error) {
        throw new Error(`Error getting interviews: ${error.message}`)
    }
}

// Create a new interview round
const createInterviewRound = async (jobId, roundData) => {
    try {
        // Validate job exists
        const job = await jobModel.findOneById(jobId)
        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found')
        }

        // Create new round
        const newRound = await interviewRoundModel.createNew({
            jobId,
            name: roundData.name,
            order: roundData.order
        })

        // Get all applicant progress records for this job
        const progressRecords = await interviewApplicantProgressModel.findByJobId(jobId)

        // Update each progress record to include the new round
        await Promise.all(progressRecords.map(async (record) => {
            const updatedProgress = {
                interviewProgress: [
                    ...record.interviewProgress,
                    {
                        roundId: newRound.insertedId,
                        status: null,
                        result: null
                    }
                ]
            }

            await interviewApplicantProgressModel.update(record._id.toString(), updatedProgress)
        }))

        // Get the created round
        const createdRound = await interviewRoundModel.findOneById(newRound.insertedId.toString())

        return createdRound
    } catch (error) {
        throw new Error(`Error creating interview round: ${error.message}`)
    }
}

// Create or update an interview
const saveInterview = async (dialogType, formData, job, applicant, roundId, interview = null) => {
    try {
        if (dialogType === 'add') {
            // Create new interview
            const newInterview = await interviewModel.createNew({
                jobId: job.id || job._id,
                applicantId: applicant.id || applicant._id,
                roundId: roundId,
                date: formData.date,
                type: formData.type,
                platform: formData.platform,
                link: formData.link,
                location: formData.location,
                interviewers: formData.interviewers,
                notes: formData.notes,
                status: 'Chờ xác nhận'
            })

            // Update applicant progress
            await updateApplicantProgress(
                applicant.id || applicant._id,
                job.id || job._id,
                roundId,
                { status: 'Chờ xác nhận' }
            )
            

            return await interviewModel.findOneById(newInterview.insertedId.toString())

        } else if (dialogType === 'edit') {
            // Update existing interview
            const updatedInterview = await interviewModel.update(interview.id || interview._id, {
                date: formData.date,
                type: formData.type,
                platform: formData.platform,
                link: formData.link,
                location: formData.location,
                interviewers: formData.interviewers,
                notes: formData.notes
            })
            const applicantData = await getApplicantById(applicant.id)
            const jobData = await jobModel.findOneById(job.id)


            BrevoProvider.sendEmail(applicantData.email, 'Vè việc thay đổi thông tin lịch phỏng vấn', emailTemplates.interviewLocationChange(applicantData.fullName, jobData.title, updatedInterview.date, updatedInterview.type, updatedInterview.location ))
            return updatedInterview
        } else if (dialogType === 'evaluate') {
            // Update interview with evaluation
            const updatedInterview = await interviewModel.update(interview.id || interview._id, {
                status: 'Đã hoàn thành',
                evaluation: formData.evaluation
            })


            // Update applicant progress

            await updateApplicantProgress(
                applicant.id || applicant._id,
                job.id || job._id,
                interview.id,
                roundId,
                {
                    status: 'Đã hoàn thành',
                    result: formData.evaluation.result
                }
            )


            // If passed, update current round to next round
            if (formData.evaluation.result === 'Đạt') {
                // Get all rounds for this job
                const rounds = await interviewRoundModel.findByJobId(job.id || job._id)

                // Sort by order
                rounds.sort((a, b) => a.order - b.order)

                // Find current round index
                const currentRoundIndex = rounds.findIndex(r =>
                    r._id.toString() === (interview.id?.toString() || interview.id)
                )

                // If there's a next round, update current round
                if (currentRoundIndex < rounds.length - 1) {
                    const nextRound = rounds[currentRoundIndex + 1]

                    await interviewApplicantProgressModel.updateByApplicantAndJob(
                        applicant.id || applicant._id,
                        job.id || job._id,
                        { currentRound: nextRound._id }
                    )

                    // Send email notification
                    const applicantData = await getApplicantById(applicant.id)
                    const jobData = await jobModel.findOneById(job.id)

                    await BrevoProvider.sendEmail(
                        applicantData.email,
                        'Thông báo kết quả phỏng vấn',
                        emailTemplates.nextRoundInvitation(applicantData.fullName, jobData.title, nextRound.name)
                    )

                } else {
                    // If this was the last round and passed, update overall status
                    await interviewApplicantProgressModel.updateByApplicantAndJob(
                        applicant.id || applicant._id,
                        job.id || job._id,
                        { currentOverallStatus: 'Đạt' }
                    )
                }
            } else {
                // If failed, update overall status
                await interviewApplicantProgressModel.updateByApplicantAndJob(
                    applicant.id || applicant._id,
                    job.id || job._id,
                    { currentOverallStatus: 'Không đạt' }
                )
               // Send rejection email

                const applicantData = await getApplicantById(applicant.id)
                const jobData = await jobModel.findOneById(job.id)
                await BrevoProvider.sendEmail(
                    applicantData.email,
                    'Thông báo kết quả phỏng vấn',
                    emailTemplates.interviewRejection(applicantData.fullName, jobData.title)
                )
            }
            return updatedInterview
        } else if (dialogType === 'editOverallEvaluation') {
            // Update overall evaluation
            await interviewApplicantProgressModel.updateByApplicantAndJob(
                applicant.id || applicant._id,
                job.id || job._id,
                {
                    currentOverallStatus: formData.currentOverallStatus,
                    skills: formData.skills,
                    overallNotes: formData.overallNotes
                }
            )

            // Get updated progress
            const updatedProgress = await interviewApplicantProgressModel.findByApplicantAndJob(
                applicant.id || applicant._id,
                job.id || job._id
            )

            return updatedProgress
        }
    } catch (error) {
        throw new Error(`Error saving interview: ${error.message}`)
    }
}

// Helper function to update applicant progress for a specific round

const updateApplicantProgress = async (applicantId, jobId, interviewId ,roundId, updateData) => {
    try {
        // Get progress record

        const progress = await interviewApplicantProgressModel.findByApplicantAndJob(applicantId, jobId)


        if (!progress) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Applicant progress record not found')
        }

        // Update the specific round in interviewProgress
        const updatedInterviewProgress = progress.interviewProgress.map(p => {
            if (p.roundId.toString() === roundId.toString()) {
                return {
                    ...p,
                    ...updateData
                }
            }
            return p
        })
       
        // Update progress record
        await interviewApplicantProgressModel.update(progress._id.toString(), {
            interviewProgress: updatedInterviewProgress
        })

        return true
    } catch (error) {
        throw new Error(`Error updating applicant progress: ${error.message}`)
    }
}

// Delete an interview
const deleteInterview = async (interviewId) => {
    try {
        // Get interview details before deleting
        const interview = await interviewModel.findOneById(interviewId)

        if (!interview) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Interview not found')
        }

        // Delete the interview
        const result = await interviewModel.deleteInterview(interviewId)

        // Update applicant progress
        await updateApplicantProgress(
            interview.applicantId.toString(),
            interview.jobId.toString(),
            interview.roundId.toString(),
            { status: null, result: null }
        )

        return result
    } catch (error) {
        throw new Error(`Error deleting interview: ${error.message}`)
    }
}

// Send interview invitation
const sendInvitation = async (interviewId) => {
    try {
        // Get interview details
        const interview = await interviewModel.findOneById(interviewId)

        if (!interview) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Interview not found')
        }

        // Get applicant details
        const application = await applyModel.findOneById(interview.applicantId.toString())

        if (!application) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Application not found')
        }

        // Get job details
        const job = await jobModel.findOneById(interview.jobId.toString())

        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found')
        }

        // Format date
        const formattedDate = new Date(interview.date).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        // Determine location based on interview type
        const location = interview.type === 'Online' ? interview.link : interview.location

        // Send email

        await BrevoProvider.sendEmail(
            application.email,
            'Thư mời phỏng vấn',
            emailTemplates.interviewInvitation(
                application.fullName,
                job.title,
                formattedDate,
                interview.type,
                location
            )
        )

        // Update interview status
        const updatedInterview = await interviewModel.update(interviewId, {
            status: 'Đã xác nhận'
        })

        // Update applicant progress
        await updateApplicantProgress(
            interview.applicantId.toString(),
            interview.jobId.toString(),
            interview.roundId.toString(),
            { status: 'Đã xác nhận' }
        )

        return updatedInterview
    } catch (error) {
        throw new Error(`Error sending invitation: ${error.message}`)
    }
}

// Get applicants for a specific round
const getApplicantsForRound = async (jobId, roundId) => {
    try {
        // Get all progress records for this job
        const progressRecords = await interviewApplicantProgressModel.findByJobId(jobId)

        // Filter applicants who are in this round
        const applicantIds = progressRecords
            .filter(record => record.currentRound?.toString() === roundId.toString())
            .map(record => record.applicantId.toString())

        // Get applicant details
        const applicants = await Promise.all(
            applicantIds.map(async (id) => {
                const application = await applyModel.findOneById(id)
                return application
            })
        )

        return applicants.filter(app => app !== null)
    } catch (error) {
        throw new Error(`Error getting applicants for round: ${error.message}`)
    }
}

// Get interviews for a specific round
const getRoundInterviews = async (jobId, roundId) => {
    try {
        const interviews = await interviewModel.findByRoundId(roundId)
        return interviews.filter(interview => interview.jobId.toString() === jobId.toString())
    } catch (error) {
        throw new Error(`Error getting round interviews: ${error.message}`)
    }
}

// Get applicant by ID
const getApplicantById = async (applicantId) => {
    try {
        const applicant = await applyModel.findOneById(applicantId)
        return applicant
    } catch (error) {
        throw new Error(`Error getting applicant: ${error.message}`)
    }
}

const getQualifiedApplicantsByEmployerId = async (employerId) => {
    try {
        const jobs = await jobModel.findByEmployerId(employerId);

        if (!jobs || jobs.length === 0) {
            return [];
        }

        const jobIds = jobs.map(job => job._id);

        // Lấy tất cả các bản ghi tiến trình cho các job này
        const allProgressPromises = jobIds.map(async (jId) => {
            const progress = await interviewApplicantProgressModel.findByJobId(jId.toString());
            return progress;
        });
        const allProgressRecords = (await Promise.all(allProgressPromises)).flat();

        const progressMap = {};
        allProgressRecords.forEach(record => {
            progressMap[record.applicantId.toString()] = record;
        });

        // Lấy tất cả ứng dụng (applications) liên quan đến các job này
        // (applyModel.findByJobIds - giả định hàm này tồn tại, nếu không bạn cần lặp qua jobIds và gộp)
        // Nếu applyModel chỉ có findByJobId (cho 1 jobId), bạn sẽ cần làm như sau:
        const allApplicationsPromises = jobIds.map(async (jId) => {
            const applications = await applyModel.findApplicationByJobIdInInterviewPhase(jId.toString());
            return applications;
        });
        const allApplications = (await Promise.all(allApplicationsPromises)).flat();

        if (!allApplications || allApplications.length === 0) {
            return [];
        }

        // Tạo một Map để dễ dàng truy cập thông tin job (quan trọng để lấy interviewRounds)
        const jobsMap = {};
        jobs.forEach(job => {
            jobsMap[job._id.toString()] = job;
        });

        // Lấy thông tin chi tiết của từng ứng viên
        const qualifiedApplicants = await Promise.all(allApplications.map(async (app) => {
            const userProfile = await userModel.findOneByEmail(app.email); // Lấy profile người dùng
            let progress = progressMap[app._id.toString()]; // Lấy record tiến trình đã có

            // Lấy thông tin job và interviewRounds của job mà ứng viên này ứng tuyển
            const applicantJob = jobsMap[app.jobId.toString()];
            let interviewRounds = [];
            if (applicantJob) {
                // Giả định jobModel.findByEmployerId đã trả về job.interviewRounds
                // Nếu không, bạn có thể cần fetch lại interviewRounds cho từng job.
                // Hoặc nếu interviewRounds được lưu trực tiếp trong job object, sử dụng nó.
                interviewRounds = await interviewRoundModel.findByJobId(applicantJob._id.toString());
            }

            // --- BỔ SUNG LOGIC TẠO initialProgress ---
            if (!progress) {
                console.warn(`Applicant ${app._id} for job ${app.jobId} has no progress record. Creating initial progress.`);

                const initialProgress = {
                    applicantId: app._id.toString(),
                    jobId: app.jobId.toString(), // Đảm bảo dùng jobId của applicant
                    currentOverallStatus: 'Đang đánh giá',
                    skills: [],
                    overallNotes: ''
                };

                // Nếu có vòng phỏng vấn, set currentRound và interviewProgress ban đầu
                if (interviewRounds.length > 0) {
                    initialProgress.currentRound = interviewRounds[0]._id;
                    initialProgress.interviewProgress = interviewRounds.map(round => ({
                        roundId: round._id,
                        status: null,
                        result: null
                    }));
                } else {
                    initialProgress.currentRound = null;
                    initialProgress.interviewProgress = [];
                }

                const newProgressRecord = await interviewApplicantProgressModel.createNew(initialProgress);

                // Cập nhật biến progress để nó chứa bản ghi mới tạo
                progress = {
                    ...initialProgress,
                    _id: newProgressRecord.insertedId // Gán _id từ kết quả insert
                };
            }
            // --- KẾT THÚC LOGIC BỔ SUNG ---


            return {
                id: app._id.toString(),
                jobId: app.jobId.toString(),
                name: app.fullName || userProfile?.name || '',
                email: app.email,
                phone: app.phoneNumber || userProfile?.phone || '',
                appliedDate: app.createdAt,
                tests: app.tests || [],
                currentOverallStatus: progress.currentOverallStatus,
                currentRound: progress.currentRound,
                interviewProgress: progress.interviewProgress,
                skills: progress.skills,
                education: userProfile?.education || [],
                experience: userProfile?.experience || [],
                overallNotes: progress.overallNotes
            };
        }));

        return qualifiedApplicants.filter(applicant => applicant !== null);

    } catch (error) {
        // Ném lỗi với thông báo chi tiết hơn
        throw new Error(`Error getting qualified applicants by employer: ${error.message}`);
    }
}

export const interviewManagementService = {
    getJobsWithInterviewRounds,
    getQualifiedApplicants,
    getInterviewsByJobId,
    createInterviewRound,
    saveInterview,
    deleteInterview,
    sendInvitation,
    getApplicantsForRound,
    getRoundInterviews,
    getApplicantById,
    getQualifiedApplicantsByEmployerId
}