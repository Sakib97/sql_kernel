import { toast } from "react-hot-toast";
import styles from './CustomToast.module.css';

const getIcon = (type) => {
    switch (type) {
        case "success":
            return "fi fi-ss-check-circle";
        case "error":
            return "fi fi-ss-circle-xmark";
        case "info":
            return "fi fi-ss-info";
        case "warning":
            return "fi fi-ss-triangle-warning";
        case "save":
            return "fi fi-ss-disk";
        case "delete":
            return "fi fi-rr-trash";
        case "exclamation":
            return "fi fi-br-exclamation";
        default:
            return "fi fi-ss-info";
    }
};

const getBorderColor = (type) => {
    switch (type) {
        case "success":
            return 'green';
        case "error":
            return 'red';
        case "info":
            return 'blue';
        case "warning":
            return 'orange';
        case "save":
            return 'green';
        case "delete":
            return 'red';
        case "exclamation":
            return 'red';
        default:
            return 'white';
    }
};

export const showToast = (message, type = "info", id = null) => {
    // dismiss existing toast with same ID before showing new one
    if (id) toast.dismiss(id);

    toast((t) => (
        <div className={styles.customToastContainer}>
            <i className={`${getIcon(type)}`} style={{ fontSize: '22px', color: getBorderColor(type) }}></i>
            &nbsp;
            {message}
            <div className={styles.crossBtn} onClick={() => toast.dismiss(t.id)}>
                <i  className="fi fi-br-cross" style={{fontSize:'16px'}}></i>
            </div>
        </div>
    ),
        {
            id,
            style: {
                borderRadius: '10px',
                background: '#fff',
                color: 'black',
                border: `2px solid ${getBorderColor(type)}`,
                fontSize: '18px',
            },
            duration: type === 'error' ? 4000 : 3000,
        }
    );
}