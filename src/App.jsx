import React from 'react';
import './App.scss';
import EditorView from './views/EditorView/EditorView';
import MainView from './views/MainView/MainView';
import {connect} from 'react-redux';
import PopupView from './views/PopupView/PopupView';
import MobileMainView from './views/MobileMainView/MobileMainView';
import {Settings} from './settings/Settings';
import {SizeItUpView} from './views/SizeItUpView/SizeItUpView';
import {PlatformModel} from './staticModels/PlatformModel';
import classNames from 'classnames';
import NotificationsView from './views/NotificationsView/NotificationsView';

const App = (
    {
        projectType,
        windowSize,
        isObjectDetectorLoaded,
        isPoseDetectionLoaded,
        isYOLOV5ObjectDetectorLoaded,
        roboflowAPIDetails
    }
) => {
    const selectRoute = () => {
        if (!!PlatformModel.mobileDeviceData.manufacturer && !!PlatformModel.mobileDeviceData.os)
            return <MobileMainView />;
        if (!projectType)
            return <MainView />;
        else {
            if (windowSize.height < Settings.EDITOR_MIN_HEIGHT || windowSize.width < Settings.EDITOR_MIN_WIDTH) {
                return <SizeItUpView />;
            } else {
                return <EditorView />;
            }
        }
    };
    const isAILoaded = isObjectDetectorLoaded
        || isPoseDetectionLoaded
        || isYOLOV5ObjectDetectorLoaded
        || (roboflowAPIDetails.model !== '' && roboflowAPIDetails.key !== '' && roboflowAPIDetails.status)

    return (
        <div className={classNames('App', {'AI': isAILoaded})} draggable={false}>
            {selectRoute()}
            <PopupView />
            <NotificationsView />
        </div>
    );
};


const mapStateToProps = (state) => ({
    projectType: state.general.projectData.type,
    windowSize: state.general.windowSize,
    isSSDObjectDetectorLoaded: state.ai.isSSDObjectDetectorLoaded,
    isPoseDetectorLoaded: state.ai.isPoseDetectorLoaded,
    isYOLOV5ObjectDetectorLoaded: state.ai.isYOLOV5ObjectDetectorLoaded,
    roboflowAPIDetails: state.ai.roboflowAPIDetails
});

export default connect(mapStateToProps)(App);
