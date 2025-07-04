/* eslint-disable*/

import { employerModel } from '~/models/employerModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
const { hashSync } = bcryptjs
import { v4 as uuidv4 } from 'uuid'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import moment from 'moment'
import { toArray } from 'lodash'
import { pickDataEmployer } from '~/utils/formatter'
import ms from 'ms'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'
import { jobModel } from '~/models/jobModel'

const generateHtmlContent = (verificationLink) => {
    return `
 <div style="
        max-width: 500px;
        margin: 30px auto;
        padding: 30px;
        background: linear-gradient(135deg, #ffffff, #e8e8e8);
        border-radius: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-align: center;
    ">
        <!-- Logo section -->
        <div style="margin-bottom: 20px; align-items: center; justify-content: center;">
            <img src="https://res.cloudinary.com/sonpham811205/image/upload/v1743226032/Pink_Cartoon_Toy_Store_Logo_1_jfngiu-removebg-preview_utidiz.png" alt="Logo" style="max-width: 100px;">
          
        </div>
          <div style="background-color: #fff8e6; border-left: 4px solid #ffc107; padding: 12px; margin: 0 auto 20px; max-width: 80%; text-align: center;">
            <p style="margin: 0; color: #d35400; font-size: 14px;">
                ⏳ <strong>Action required:</strong> This verification link expires in <span style="font-weight: 700; color: #e74c3c;">30 minutes</span>
            </p>
        </div>
        <h2 style="color:rgb(29, 40, 52); margin-bottom: 20px; font-size: 22px; font-weight: 600;">Complete Your Registration</h2>
        
        <!-- Expiration notice with icon -->
      
        
        <p style="font-size: 15px; color: #8c8989; margin-bottom: 25px; line-height: 1.6;">
            Thank you for joining IT_Jobs! To activate your account, please verify your email address by clicking below:
        </p>
        
        <!-- Improved button with hover effect -->
        <a href="${verificationLink}" style="
            display: inline-block;
            padding: 14px 30px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 3px 10px rgba(52, 152, 219, 0.3);
            transition: all 0.3s ease;
            margin-bottom: 20px;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(52, 152, 219, 0.4)'" 
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 10px rgba(52, 152, 219, 0.3)'">
            Verify My Email
        </a>
        
        <!-- Dynamic cat image with fallback -->
        <div style="margin-top: 30px;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnlNGPPApAN2iXnLKN2FIu5O-5RiO7h_fCpYUVVJhYFvNWOhlAocsw4SU121GyQ4FDV0U&usqp=CAU" alt="Meow Meow" style="width: 100px; border-radius: 50%;">
        </div>
        
        <!-- Footer with improved styling -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 13px; color: #7f8c8d; margin-bottom: 8px;">
                Need help? <a href="mailto:support@itjobs.com" style="color: #3498db; text-decoration: none;">Contact our support team</a>
            </p>
            <p style="font-size: 14px; color: #555; line-height: 1.5; margin: 0;">
                Best regards,<br>
                <strong style="color: #2c3e50;">Team 18</strong> - HCMUIT<br>
                <span style="font-size: 13px; color: #95a5a6;">Member of <strong style="color: #16a085;">F4ThuDuc</strong> Team</span>
            </p>
        </div>
</div>
    `;
};


const createNew = async(reqBody) => {
    try {
        // check eamil exists
        const checkEmployerExists = await employerModel.findOneByEmail(reqBody.email)
        if(checkEmployerExists)
        {
            if(!checkEmployerExists.isActive)
            {
                checkEmployerExists.verifyToken = uuidv4()
                checkEmployerExists.tokenLinkExpiration = moment().add(15, 'minute').toDate()
                await employerModel.update(checkEmployerExists._id, {
                    verifyToken: checkEmployerExists.verifyToken,
                    tokenLinkExpiration: checkEmployerExists.tokenLinkExpiration,
                    password: hashSync(reqBody.password, 8)
                })

                
                const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${checkEmployerExists.email}&token=${checkEmployerExists.verifyToken}`
                const customSubject = 'IT_Jobs: Resend Email Verification'
                await BrevoProvider.sendEmail(employerModel.email,customSubject,generateHtmlContent(verificationLink))
            
                return pickDataEmployer(checkEmployerExists)
            }
            else
                throw new ApiError(StatusCodes.CONFLICT, 'Email is already being used !!!')
        }

        // create data to save in db
        const employerData = {
            email: reqBody.email,
            password: bcryptjs.hashSync(reqBody.password, 8),
            fullName:reqBody.fullName,
            phoneNumber: reqBody.phoneNumber,
            position: reqBody.position,
            workEmail: reqBody.workEmail,
            companyLocation: reqBody.companyLocation,
            companyName: reqBody.companyName,
            companyCountry: reqBody.companyCountry,
            companyURL: reqBody.companyURL, 
            verifyToken: uuidv4(),
            logoURL: 'https://res.cloudinary.com/sonpham811205/image/upload/v1745513898/31f3ea192296a4596fcf0747c5c7c1ea_pvidlh.jpg',
            backgroundURL: 'https://res.cloudinary.com/sonpham811205/image/upload/v1745513906/Anhpng.com_30-4_-_gi%E1%BA%A3i_ph%C3%B3ng_Mi%E1%BB%81n_Nam_28_jvqezn.jpg',

            // companyDescription: reqBody.companyDescription || null,
            role: "employer", 
            tokenLinkExpiration: moment().add(30, 'minutes').toDate(),
        }
        const createEmployer = await employerModel.createNew(employerData)
        const getNewEmployer = await employerModel.findOneById(createEmployer.insertedId)

        const verificationLink = `${WEBSITE_DOMAIN}/employer/account/verification?email=${getNewEmployer.email}&token=${getNewEmployer.verifyToken}`
        const customSubject = 'IT_Jobs: Please verify your email before using our services'
        

        //Gọi tới Provider gửi mail
         await BrevoProvider.sendEmail(getNewEmployer.email,customSubject,generateHtmlContent(verificationLink))
        return pickDataEmployer(getNewEmployer);
    } catch (error) {
        throw error
    }
}

const verify = async(reqBody) => {
    try {
        // Lấy employer trong db
        const employer = await employerModel.findOneByEmail(reqBody.email)
        // Các bước để verify (exsist user, already active, verify token match, ...)
        if (!employer) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found !!!')
        if (employer.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is already active')
        if (moment().isAfter(employer.tokenLinkExpiration)) throw new ApiError(StatusCodes.BAD_REQUEST, 'Your link is expired, Please register again')
        if(reqBody.token !== employer.verifyToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')

        const updateEmployer = {
            isActive: true,
            verifyToken: null,
            tokenLinkExpiration: null
        }
        
        const response = await employerModel.update(employer._id, updateEmployer)
        return pickDataEmployer(response)
    } catch (error) {
        throw error
    }
}

const login = async(reqBody) => {
    try {
        const employer = await employerModel.findOneByEmail(reqBody.email)

        if (!employer)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found !!')
        if (!employer.isActive)
            throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Please verify account before loging')
        if(!bcryptjs.compareSync(reqBody.password, employer.password))
            throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email or password is incorrect !')

        const employerInfo = {
            _id: employer._id,
            email: employer.email
        }

        const accessToken = await JwtProvider.generateToken(employerInfo, env.ACCESS_TOKEN_SIGNATURE,'1h')
        const refreshToken = await JwtProvider.generateToken(employerInfo, env.REFRESH_TOKEN_SIGNATURE, '7d')

        return {accessToken, refreshToken, ...pickDataEmployer(employer)}
    } catch (error) {
        throw error
    }
}

const updateEmployer = async(employerId, reqBody, logoFile, backgroundFile) => {
    try {
        const employer = employerModel.findOneById(employerId)
        if(!employer)
            throw new ApiError(StatusCodes.NOT_FOUND, "Employer not found")

        let updateEmployer = {}
        const dataUpdate = {
            ...reqBody,
            updateAt : Date.now()
        }
        if(logoFile)
        {
            const uploadResult = await cloudinaryProvider.streamUpLoad(logoFile.buffer, 'dataEmployer')
            updateEmployer = await employerModel.update(employerId, {
                logoURL: uploadResult.secure_url
            })
        }
        else if(backgroundFile)
        {
            const uploadResult = await cloudinaryProvider.streamUpLoad(backgroundFile.buffer, 'dataEmployer')
            updateEmployer = await employerModel.update(employerId, {
                backgroundURL: uploadResult.secure_url
            })
        }
        else
            updateEmployer = await employerModel.update(employerId, dataUpdate)

        return pickDataEmployer(updateEmployer)
    } catch (error) {
        throw error
    }
}

const getEmployerById = async(employerId) => {
    try {
        const response = await employerModel.findOneById(employerId)
        return pickDataEmployer(response)
    } catch (error) {
        throw error
    }
}


const getRandomEmployers = async () => {
    try {
      // Lấy danh sách nhà tuyển dụng ngẫu nhiên
      const employers = await employerModel.findRandomEmployers();
  
      if (!employers.length) return [];
  
      // Lấy employerIds để đếm số công việc
      const employerIds = employers.map((employer) => employer._id.toString());
  
      // Đếm số công việc cho từng employerId bằng findByEmployerId
      const jobCounts = await Promise.all(
        employerIds.map(async (employerId) => {
          const jobs = await jobModel.findByEmployerId(employerId);
          return { employerId, jobCount: jobs.length };
        })
      );
  
      // Tạo map để tra cứu nhanh jobCount theo employerId
      const jobCountMap = jobCounts.reduce((map, { employerId, jobCount }) => {
        map[employerId] = jobCount;
        return map;
      }, {});
  
      // Định dạng dữ liệu và thêm jobCount
      const formattedEmployers = employers.map((employer) => {
        const employerIdStr = employer._id.toString();
        const jobCount = jobCountMap[employerIdStr] || 0; // Mặc định là 0 nếu không có công việc
        
        return pickDataEmployer({ ...employer, jobCount }); // Bỏ .toObject() nếu employer đã là plain object
      });
  
      return formattedEmployers;
    } catch (error) {
      console.error("Error in getRandomEmployers:", error);
      throw new Error(`Failed to fetch random employers: ${error.message}`);
    }
  };

export const employerService = {
    createNew,
    login,
    verify,
    updateEmployer,
    getEmployerById,
    getRandomEmployers
}