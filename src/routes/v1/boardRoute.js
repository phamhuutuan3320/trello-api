import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router();

Router.route('/')
    .get((req, res) => {
        res.status(StatusCodes.OK).json({ message: 'API get list boards.' })
    })
    // Chúng ta có sử dụng next trong Validation, có nghĩa là khi boardValidation.createNew thực hiện xong, và không có lỗi
    // nó sẽ chuyển tiếp request tới boardController.createNew thông qua next(), 
    .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
    .get(boardController.getDetails)
    // Update 1 cai board cu the
    .put()

export const boardRoute = Router;
