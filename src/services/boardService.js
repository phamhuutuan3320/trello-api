import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash"


const createNew = async (reqBody) => {
    try {
        // Xử lý logic dữ liệu tùy đặc thù dự án
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        };

        // Gọi tới tầng Model để xử lý lưu bản ghi vào CSDL

        const createdBoard = await boardModel.createNew(newBoard);
        console.log("createdBoard: ", createdBoard)

        // Lấy bản ghi board sau khi gọi (Tùy mục đích dự án mà có cần bước này hay không)
        const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);

        // Làm thêm các xử lý logic khác với các Collection khác tùy vào dự án
        // chẳng hạn như bắn mail, hoặc notification vè cho admin

        // Trả kết quả về, trong service luôn phải có return cái này.
        return getNewBoard;
    }catch(err) {
        throw new Error(err);
    }
}

const getDetails = async (id) => {
    try {
        const board = await boardModel.getDetails(id);
        if(!board) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found');
        }

        // Clone board ra một cái mới để xử lý, không ảnh hưởng tới board ban đầu,
        const resBoard = cloneDeep(board);

        // đưa card vào đúng column
        resBoard.columns.forEach(column => {

            // Dùng với toString của js
            // column.cards = resBoard.cards.filter( card => card.columnId.toString() === column._id.toString())

            // Hoặc là dùng cách dưới, tại vì mongodb hỗ trợ phương thức equals
            column.cards = resBoard.cards.filter( card => card.columnId.equals(column._id))
        });
        // Xóa đi mảng cards nằm ngoài column, vì chúng ta đã đưa vào trong rồi
        delete resBoard.cards
        return resBoard;
    }catch(err) {
        throw new Error(err);
    }
}

export const boardService = {
    createNew,
    getDetails
}