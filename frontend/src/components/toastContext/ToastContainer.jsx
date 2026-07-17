import { useSelector, useDispatch } from "react-redux";
import Toast from "../Toast";
import { removeToast } from "../../redux/features/toastSlice";

const ToastContainer = () => {
  const toasts = useSelector((state) => state.toast.toasts);
  const dispatch = useDispatch();

  return (
    <div
      className="fixed top-8 right-8 z-9000 flex flex-col gap-3 max-[600px]:bottom-4 max-[600px]:right-4 max-[600px]:left-4"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onRemove={() => dispatch(removeToast(t.id))}
        />
      ))}
    </div>
  );
};

export default ToastContainer;