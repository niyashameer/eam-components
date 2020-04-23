import React, {Component} from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import FontIcon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import Fullscreen from '@material-ui/icons/Fullscreen'
import { FullscreenExit } from 'mdi-material-ui';

class EISPanel extends Component {

    state = {
        panelExpanded: true
    };

    headingStyle = {
        display: "flex",
        alignItems: "center",
        fontWeight: 500,
    };

    headingIconStyle = {
        fontSize: 20,
        marginRight: 7
    };

    summaryStyle = {
        backgroundColor: "#fafafa",
        borderBottom: "1px solid #EEEEEE",
        minHeight: '45px',
        height: '45px'
    };

    linkIconStyle = {
        color: "#00aaff"
    };
    linkClickHandler() {
        window.open(this.props.link, '_blank');
    }

    _onPanelChange = (object, expanded) => {
        if (this.props.alwaysExpanded) {
            expanded = true;
        }
        this.setState(() => ({
            panelExpanded: expanded
        }));

        if (this.props.onPanelChange) {
            this.props.onPanelChange(expanded);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        // if panelExpanded is passed as prop and is different from the current
        // state.panelExpanded then we update the state
        if (typeof nextProps.panelExpanded !== "undefined" && nextProps.panelExpanded !== prevState.panelExpanded) {
            return {
                panelExpanded: nextProps.panelExpanded
            }
        }

        // No state update necessary
        return null;
    }

    render() {

        return (
            <ExpansionPanel defaultExpanded expanded={this.props.alwaysExpanded ? true : this.state.panelExpanded}
                            TransitionProps={{ timeout: 300 }}
                            onChange={this._onPanelChange}>
                <ExpansionPanelSummary expandIcon={this.props.alwaysExpanded ? undefined : <ExpandMoreIcon/>}
                                       style={this.summaryStyle}>
                    <div style={this.headingStyle}>
                        {this.props.headingIcon && (
                            <FontIcon style={this.headingIconStyle} className={"fa " + this.props.headingIcon}/>
                        )}
                        <div>
                            {this.props.heading}
                        </div>
                        {this.props.link && (
                            <IconButton onClick={this.linkClickHandler.bind(this)} style={{height: "auto", width: 35}}>
                                <OpenInNewIcon style={this.linkIconStyle}/>
                            </IconButton>
                        )}
                        {this.props.headingBar}

                    </div>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails style={{...this.props.detailsStyle}}>
                    {this.props.children}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export const withFullscreen = (props) => (Component) => {
    const { isOpen, onFullscreenOpen, onFullscreenClose } = props;
    return (props) => <Component headingBar={
        isOpen
        ? <IconButton onClick={(e) => { e.stopPropagation(); onFullscreenOpen() }}><Fullscreen /></IconButton>
        : <IconButton onClick={(e) => { e.stopPropagation(); onFullscreenClose() }}><FullscreenExit /></IconButton> 
        } {...props}/>
}

EISPanel.defaultProps = {
    alwaysExpanded: false,
    onPanelChange: undefined
};

export default EISPanel;