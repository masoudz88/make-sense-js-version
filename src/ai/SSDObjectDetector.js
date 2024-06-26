import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {store} from '../index';
import {updateSSDObjectDetectorStatus} from '../store/ai/actionCreators';
import {LabelType} from '../data/enums/LabelType';
import {LabelsSelector} from '../store/selectors/LabelsSelector';
import {AISSDObjectDetectionActions} from '../logic/actions/AISSDObjectDetectionActions';
import {updateActiveLabelType} from '../store/labels/actionCreators';
import {submitNewNotification} from '../store/notifications/actionCreators';
import {NotificationUtil} from '../utils/NotificationUtil';
import {NotificationsDataMap} from '../data/info/NotificationsData';
import {Notification} from '../data/enums/Notification';

export class SSDObjectDetector {
    static loadModel(callback) {
        cocoSsd
            .load()
            .then((model) => {
                SSDObjectDetector.model = model;
                store.dispatch(updateSSDObjectDetectorStatus(true));
                store.dispatch(updateActiveLabelType(LabelType.RECT));
                const activeLabelType = LabelsSelector.getActiveLabelType();
                if (activeLabelType === LabelType.RECT) {
                    AISSDObjectDetectionActions.detectRectsForActiveImage();
                }
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                // TODO: Introduce central logging system like Sentry
                store.dispatch(submitNewNotification(
                    NotificationUtil.createErrorNotification(NotificationsDataMap[Notification.MODEL_DOWNLOAD_ERROR])
                ))
            })
    }

    static predict(image, callback) {
        if (!SSDObjectDetector.model) return;

        SSDObjectDetector.model
            .detect(image)
            .then((predictions) => {
                if (callback) {
                    callback(predictions)
                }
            })
            .catch((error) => {
                // TODO: Introduce central logging system like Sentry
                store.dispatch(submitNewNotification(
                    NotificationUtil.createErrorNotification(NotificationsDataMap[Notification.MODEL_INFERENCE_ERROR])
                ))
            })
    }
}
