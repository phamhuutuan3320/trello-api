import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environment";

let trelloDatabaseInstance = null;


// Khởi tạo một đối tượng mongoClientInstance để connect tới Mongodb
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {

    // Serer API xuất hiện từ phiên bản MongoDB 5.0.0. trở lên, có thể không cần dùng nó,
    // nhưng nếu dùng thì ta sẽ chỉ định 1 cái Stable API version của Mongodb
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
} );  


// Hàm kết nối tới DB
export const CONNECT_DB = async () => {
    // Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của clientInstance
    await mongoClientInstance.connect();


    // Kết nối thành công thì lấy ra database theo tên và gán ngược nó lại vào biến trelloDatabaseInstance
    trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

// Hàm GET_DB (Không async) này có nhiệm vụ export ra cái Trello database instance sau khi
// đã connect thành công tới MongoDB, chúng ta sẽ gọi hàm này nhiều nơi khác nhau trong code.

// Lưu ý chỉ gọi hàm này sau khi connect tới DB thành công.
export const GET_DB = () => {
    if(!trelloDatabaseInstance) throw new Error('Must connect to Database first!')
    return trelloDatabaseInstance;
}

// Đóng kết nối tới MongoDB khi cần
export const CLOSE_DB = async () => {
    console.log(`Closing connecting to MongoDB`);
    await mongoClientInstance.close();
}