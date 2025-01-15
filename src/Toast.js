import { toast } from "react-toastify";
class Toast {
  constructor(message, type, code) {
    this.message = message;
    this.type = type;
    this.code = code;
  }
  show() {
    toast(this.message, {
      position: "top-center",
      type: this.type,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
}
export default Toast;