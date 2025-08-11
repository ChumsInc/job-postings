import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {dismissAlert, selectAlerts} from "./index";
import Alert from "react-bootstrap/Alert";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const alerts = useSelector(selectAlerts);

    const dismissHandler = (key: string | number) => dispatch(dismissAlert(key));

    return (
        <div>
            {Object.keys(alerts).map(key => (
                <Alert key={key} variant="danger" onClose={() => dismissHandler(key)}>
                    [<strong>{alerts[key].context}</strong>] {alerts[key].message}
                    {!!alerts[key].error && (
                        <div style={{whiteSpace: 'pre-wrap'}}>{alerts[key].error?.stack}</div>
                    )}
                </Alert>
            ))}
        </div>
    )
}

export default AlertList;
