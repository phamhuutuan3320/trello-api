import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
    try {
        // log dữ liệu được thêm trong phần body của request.
        // console.log("req body: ", req.body)

        // Điều hướng dữ liệu đến tầng Service.
        const createdBoard = await boardService.createNew(req.body);
        


        // Ném 1 custom error, để test cái catch err
        // throw new ApiError(StatusCodes.BAD_GATEWAY, "Loi cua Tuan ");

        // Có kết quả trả về phía client
        res.status(StatusCodes.CREATED).json(createdBoard);
    } catch (err) {
        // next này có tham số, cho nên nó sẽ chuyển đến middleware xử lý lỗi
        next(err)
    }
}

const getDetails = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const board = await boardService.getDetails(boardId);
        res.status(StatusCodes.OK).json(board);
    } catch (err) {
        // next này có tham số, cho nên nó sẽ chuyển đến middleware xử lý lỗi
        next(err)
    }
}

export const boardController = {
    createNew,
    getDetails
}