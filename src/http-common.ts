import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Content-type": "application/json",
  }
});