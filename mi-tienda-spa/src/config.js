const PRODUCTION_BACKEND_URL = "https://el-palacio-2da-version-pqtm.vercel.app/"; 

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001' 
  : PRODUCTION_BACKEND_URL; 

export default API_BASE_URL;