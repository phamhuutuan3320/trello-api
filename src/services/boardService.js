import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
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

export const boardService = {
    createNew
}