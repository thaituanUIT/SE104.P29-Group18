import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES }  from '~/utils/validator'

const filterFile = (req, file, cb) =>  {
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype))    
        return cb(new ApiError(StatusCodes.NOT_ACCEPTABLE, 'File style is not allowed'), null)
    return cb(null, true)
}

const upload = multer({
    fileFilter: filterFile,
    limits: { fileSize: LIMIT_COMMON_FILE_SIZE }
})

export const uploadMiddleware = { upload }