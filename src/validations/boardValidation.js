import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { BOARD_TYPES } from "~/utils/constants";


const createNew = async (req, res, next) => {

    // đưa ra một entity điều kiện
    const correctCondition = Joi.object({
        title: Joi.string()
            .required()
            .min(3)
            .max(50)
            .trim().strict(), // 2 cái này đi kèm với nhau thì nó mới bắt lỗi khoảng trắng đầu cuối
        description: Joi.string()
            .required()
            .min(3)
            .max(256)
            .trim().strict(),
        type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
    })
    try {


        // Kiểm tra cái nội dung bên FE gửi đi có đúng với điều kiện mà chúng ta đưa ra hay không

        // Cái { abortEarly: false} này sẽ không cho việc validate dừng sớm, tức là nếu validate thấy có lỗi
        // thì tiếp tục validate các phần khác chứ không có dừng lại, làm thế này thì nó sẽ trả được về nhiều lỗi.
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        // đưa cái request tới tầng khác để xử lý, cụ thể là tầng controller hoặc middleware sau khi validate thành công
        // Thực chất việc này là chuyển tiếp middleware hiện tại tới middleware kế tiếp trong chuỗi middleware
        next();
    } catch (err) {
        // console.log(err);
        const errorMessage = new Error(err).message;
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
        next(customError);
    }

}

export const boardValidation = {
    createNew
}