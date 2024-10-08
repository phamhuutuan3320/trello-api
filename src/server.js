
import express from 'express'
// import de ket noi database
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
// import exitHook from 'async-exit-hook'

// import de thuc hien cac thao tac cleanup khi tat server
import cleanup from './utils/cleanup';

// import de lay duoc cac bien moi truong
import { env } from './config/environment';

// import để phục vụ cho cors
import cors from 'cors';

// import de phuc vu cho viec routing
import { APIs_V1 } from '~/routes/v1';

// import cho xu ly loi tap trung voi middleware
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

// import corsoption cho cors
import { corsOptions } from './config/cors';

const START_SERVER = () => {
  const app = express();


  app.use(cors(corsOptions));

  // Cần 1 thằng middleware để có thể parse được cái json từ body của request
  // Nếu không có thằng này thì request.body sẽ bị undefined
  app.use(express.json())

  // Khi dùng thêm router, chúng ta sẽ không code như này
  // app.get('/', (req, res) => {
  //   // console.log(await GET_DB().listCollections().toArray())
  //   res.end('<h1>Hello world</h1>')
  // })

  // Chúng ta sẽ code như thế này
  // Vậy thì lúc này, API sẽ đi từ đường dẫn: localhost:port/v1/<<path của tham số thứ 2>>
  app.use('/v1', APIs_V1)


  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello ${env.AUTHOR}, I am running at ${env.APP_HOST}:${env.APP_PORT}/`)
  })

  // Thực hiện các tác vụ cleanup trước khi đóng server
  cleanup(CLOSE_DB)

}

// Chỉ khi kết nối tới MongoDB thành công thì mới start Server

// CONNECT_DB()
//   .then(() => console.log("Connect to MongoDB successfully"))
//   .then(() => {
//     START_SERVER()
//   })
//   .catch(err => {
//     console.log("Error connect to MongoDB: ", err);
//     process.exit(0)
//   })

// Hoặc code như sau
(async () => {
  try {
    await CONNECT_DB();
    console.log("Connect to MongoDB successfully")
    START_SERVER()
  } catch (err) {
    console.log("Error connect to MongoDB: ", err);
    process.exit(0)
  }
})()






