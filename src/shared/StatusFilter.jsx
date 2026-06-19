import {useSearchParams} from "react-router";
import styles from './StatusFilter.module.css'

export default function StatusFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentStatus = searchParams.get("status") || "all";

    const handleStatusChange = (status) => {
        const newParams = new URLSearchParams(searchParams);

        if (status === "all") {
            newParams.delete("status");
        } else {
            newParams.set("status", status);
        }

        setSearchParams(newParams);
    };

    return (
        <div className={styles.container}>
            <button
                className={`${styles.filterButton} ${
                    currentStatus === "all" ? styles.active : ""
                }`}
                onClick={() => handleStatusChange("all")}
            >
                All
            </button>

            <button
                className={`${styles.filterButton} ${
                    currentStatus === "active" ? styles.active : ""
                }`}
                onClick={() => handleStatusChange("active")}
            >
                Active
            </button>

            <button
                className={`${styles.filterButton} ${
                    currentStatus === "completed" ? styles.active : ""
                }`}
                onClick={() => handleStatusChange("completed")}
            >
                Completed
            </button>
        </div>
    );
}