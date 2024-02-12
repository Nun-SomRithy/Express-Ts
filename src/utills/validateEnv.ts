import {cleanEnv} from "envalid";
import "dotenv/config.js"
import {str , port}  from "envalid/dist/validators";
export  default cleanEnv(process.env,{
    MONGOOSE_URL:str(),
    PORT: port()
})


