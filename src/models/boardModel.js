import Joi from "joi";
import { ObjectId } from "mongodb";

import { GET_DB } from "~/config/mongodb";
import { BOARD_TYPES } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { columnModel } from "./columnModel";
import { cardModel } from "./cardModel";


const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
    title: Joi.string()
        .required()
        .min(3)
        .max(50)
        .trim().strict(),
    description: Joi.string()
        .required()
        .min(3)
        .max(225)
        .trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
    slug: Joi.string()
        .required()
        .min(3)
        .trim().strict(),
    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)

});

const validateBeforeCreate = async (data) => {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        console.log("validData: ", validData);
        const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME)
            .insertOne(validData);
        return createdBoard;
    } catch (err) {
        throw new Error(err);
    }
}

const findOneById = async (id) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (err) {
        throw new Error(err);
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
            // Dieu kien cho boards
            {
                $match: {
                    _id: new ObjectId(id),
                    _destroy: false,
                }
            },
            // Đoạn lookup này là, đang đứng từ boards, nó sẽ chạy sang columns để tìm xem
            // columns nào có boardID trùng với _id
            {
                $lookup: {
                    from: columnModel.COLUMN_COLLECTION_NAME, //Chọn collection mà bạn muốn thực hiện phép nối

                    // Cái này nó tựa như khóa chính và khóa tham chiếu. 
                    // localField là khóa chính của boards, foreignField là khóa tham chiếu của columns
                    //, chúng ta hiểu là 1 bảng có nhiều cột
                    localField: '_id', //Trường _id trong bảng boards được sử dụng làm khoá chính.
                    foreignField: 'boardId', //Trường boardId trong bảng columns được sử dụng làm khoá tham chiếu.
                    as: 'columns' //Kết quả của phép nối này sẽ được lưu trong một mảng có tên là columns.
                }
            },
            {
                $lookup: {
                    from: cardModel.CARD_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'cards'
                }
            }
        ]).toArray();
        return result[0] || {};
    } catch (err) {
        throw new Error(err);
    }
}

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails
}

// columnID: 6704ddf129f0b52aee61731e
// board: 6704b2eb48462af4f508a102
// card: 6704eb8d29f0b52aee617322