import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { Component } from 'react';
import WSChecklists from '../../../tools/WSChecklists';
import EISPanel from '../panel';
import ChecklistEquipment from "./ChecklistEquipment";
import ChecklistItem from './ChecklistItem';
import BlockUi from 'react-block-ui';
import EAMSelect from '../inputs/EAMSelect'
import { withStyles } from '@material-ui/core/styles';

function getExpandedActivities(activities) {
    const makeEquipmentsFromActivity = activity =>
        activity.checklists.reduce((equipments, checklist) => {
            if(equipments[checklist.equipmentCode] === undefined) {
                equipments[checklist.equipmentCode] = {
                    code: checklist.equipmentCode,
                    desc: checklist.equipmentDesc,
                    collapse: function() { this.collapsed = true },
                    collapsed: false
                }
            }
            return equipments;
        }, {});

    return activities.map((activity, index) => ({
        ...activity,
        index,
        equipments: makeEquipmentsFromActivity(activity),
        collapse: function() { this.collapsed = true },
        collapsed: false,
    }));
}

// External updates on the activities will not be reflected in this component
// For instance, if the description of an activity is changed 
// in "Activities and Booked Labor", it will not be reflected here
class Checklists extends Component {
    state = {
        activities: [],
        blocking: false,
        filteredActivity: null,
        filteredEquipment: null
    }

    expansionDetailsStyle = {
        marginRight: -24,
        marginLeft: -24,
        marginTop: -8,
        marginBottom: -24
    }

    componentWillMount() {
        this.readActivities(this.props.workorder)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.workorder !== nextProps.workorder) {
            this.readActivities(nextProps.workorder)
        }
    }

    readActivities(workorder) {
        const { getWorkOrderActivities, collapseHeuristic } = this.props;

        getWorkOrderActivities(workorder)
            .then(response => {
                const activities = getExpandedActivities(response.body.data);
                const checklists = activities.reduce((checklists, activity) => checklists.concat(activity.checklists), []);

                collapseHeuristic(checklists, activities);

                this.setState({
                    activities,
                    blocking: false
                })
            })
    }

    setCollapsedEquipment(collapsed, activityIndex, equipmentCode) {
        this.setState((state, props) => {
            const activities = [...state.activities];
            const activity = {...activities[activityIndex]};
            const equipments = {...activity.equipments};
            const equipment = {
                ...equipments[equipmentCode],
                collapsed
            };
            equipments[equipmentCode] = equipment;
            activity.equipments = equipments;
            activities[activityIndex] = activity;
            return {activities};
        });
    }

    renderChecklistsForEquipment(checklists, activity) {
        const firstChecklist = checklists[0];
        const equipmentCode = firstChecklist.equipmentCode;
        const collapsed = activity.equipments[equipmentCode].collapsed;

        if(firstChecklist === undefined) {
            console.error("renderChecklistsForEquipment MUST be passed at least 1 checklist");
            return <div/>; // better to return a div than to crash
        }

        if(typeof collapsed !== 'boolean') collapsed = true;

        const { classes } = this.props;

        return <ExpansionPanel
                key={equipmentCode}
                expanded={!collapsed}
                TransitionProps={{ unmountOnExit: true, timeout: 0 }}
                onChange={(_, expanded) => this.setCollapsedEquipment(!expanded, activity.index, equipmentCode)}
                classes={{root: classes.before}}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                <ChecklistEquipment 
                    key={firstChecklist.checkListCode + "_equipment"}
                    equipmentCode={equipmentCode}
                    equipmentDesc={firstChecklist.equipmentDesc}/>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{marginTop: -18}}>
                <div style={{width: "100%"}}>
                    {checklists.map(checklist => <ChecklistItem 
                        key={'checklistItem$' + checklist.checkListCode}
                        updateChecklistItem={this.props.updateChecklistItem}
                        checklistItem={checklist}
                        handleError={this.props.handleError}
                        minFindingsDropdown={this.props.minFindingsDropdown}
                        getWoLink={this.props.getWoLink}
                    />)}
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>;
    }

    renderChecklistsForActivity(activity, filteredEquipment) {
        const { checklists } = activity;

        const result = [];

        // this stores the index of the checklists that are related to a different equipment than the one before them
        // this includes the first checklist item since it has no equipment before it
        const equipmentBoundaries = [];

        let equipmentCode;
        checklists.forEach((checklist, i) => {
            if (equipmentCode === checklist.equipmentCode) return;

            equipmentCode = checklist.equipmentCode;
            equipmentBoundaries.push(i);
        });

        // include the index after the last checklist as a boundary
        // this makes the next section of the code much simpler, since we can loop over pairs of boundaries
        equipmentBoundaries.push(checklists.length);

        // now that we have the equipment boundaries, we can make arrays of checklists
        // for each equipment in the activity, and render a collapsible menu
        for(let i = 1; i < equipmentBoundaries.length; ++i) {
            const start = equipmentBoundaries[i-1];
            const end = equipmentBoundaries[i];
            const equipmentCode = checklists[start].equipmentCode;

            if(filteredEquipment && equipmentCode !== filteredEquipment) continue;
            
            result.push(this.renderChecklistsForEquipment(checklists.slice(start, end), activity));
        }


        return result;
    }

    createFollowUpWOs (evt, checklistActivity) {
        evt.stopPropagation();
        const activity = {
            workOrderNumber: checklistActivity.workOrderNumber,
            activityCode: checklistActivity.activityCode
        }
        this.setState({blocking: true});

        WSChecklists.createFolowUpWorkOrders(activity)
            .then(resp => {
                this.readActivities(activity.workOrderNumber);
                this.props.showSuccess('Follow-up workorders successfully created.');
            })
            .catch(error => {
                this.props.showError('Could not create follow-up workorders.')
            })
            ;
    }

    setCollapsedActivity(collapsed, index) {
        this.setState((state, props) => {
            const activities = [...state.activities];
            const activity = {...activities[index]};
            activity.collapsed = collapsed;
            activities[index] = activity;
            return {activities};
        });
    }

    renderActivities(filteredActivity, filteredEquipment) {
        const { activities, blocking } = this.state;

        return activities.filter(activity => (
                activity.checklists && activity.checklists.length > 0
                    && !(filteredEquipment && activity.equipments[filteredEquipment] === undefined)
                    && !(filteredActivity && activity.activityCode !== filteredActivity)
            )).map(activity => (
                <BlockUi key={activity.activityCode} blocking={blocking}>
                    <ExpansionPanel
                        expanded={!activity.collapsed}
                        onChange={(_, expanded) => this.setCollapsedActivity(!expanded, activity.index)}
                        TransitionProps={{ unmountOnExit: true, timeout: 0 }}>
                        <ExpansionPanelSummary expandIcon={
                            <ExpandMoreIcon/>}>
                            <div style={{padding: 2,
                                flexGrow: "1",
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <span style={{fontWeight: 500}}>{activity.activityCode} - {activity.activityNote}</span>
                                <Button 
                                    key={activity.activityCode + '$createfuwo'}
                                    onClick={ evt => this.createFollowUpWOs(evt, activity) } 
                                    color="primary" 
                                    style={{marginLeft: 'auto'}}>
                                    Create Follow-up WO
                                </Button>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{margin: 0, padding: 0}}>
                            <div style={{width: "100%"}}>{this.renderChecklistsForActivity(activity, filteredEquipment)}</div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </BlockUi>
        ));
    }

    setNewFilter(filters) {
        const {activity, equipment} = filters;
        
        const activityCode = 
            activity === "" ? null : 
            activity === undefined ? undefined :
            activity.code;

        const equipmentCode =
            equipment === "" ? null : 
            equipment === undefined ? undefined :
            equipment.code;

        const { collapseHeuristic } = this.props;

        this.setState((state, props) => {
            // the activity and equipment codes that will be effectively used for the filtering
            // if any parameterized filter is unspecified (undefined), the value used is in state
            const effectiveActivityCode = activityCode === undefined ? state.filteredActivity : activityCode;
            const effectiveEquipmentCode = equipmentCode === undefined ? state.filteredEquipment : equipmentCode;

            let activityCollapsedPredicate = (activity, effectiveActivityCode) => {};
            let equipmentCollapsedPredicate = (equipmentCode, effectiveEquipmentCode) => {};

            if(effectiveActivityCode || effectiveEquipmentCode) {
                // if we're filtering, collapse everything that is not equal to our filters
                activityCollapsedPredicate = (activity) => 
                    (activity.activityCode !== effectiveActivityCode)
                    && Object.keys(activity.equipments)
                        .every(equipmentCode2 => equipmentCode2 !== effectiveEquipmentCode);
                equipmentCollapsedPredicate = (equipmentCode) => 
                    equipmentCode !== effectiveEquipmentCode;
            } else {
                // if nothing is being filter, uncollapse everything,
                // to prepare for calling the collapse heuristic
                activityCollapsedPredicate = () => false;
                equipmentCollapsedPredicate = () => false;
            }

            const newState = {
                activities: state.activities.map(activity => ({
                    ...activity,
                    collapsed: activityCollapsedPredicate(activity),
                    equipments: Object.keys(activity.equipments).reduce((equipments, thisEquipmentCode) => {
                        equipments[thisEquipmentCode] = {
                            ...activity.equipments[thisEquipmentCode],
                            collapsed: equipmentCollapsedPredicate(thisEquipmentCode)
                        };
                        return equipments;
                    }, {})})
                ),
                filteredActivity: effectiveActivityCode,
                filteredEquipment: effectiveEquipmentCode
            };

            if(!effectiveActivityCode && !effectiveEquipmentCode) {
                const checklists = newState.activities.reduce((checklists, activity) => checklists.concat(activity.checklists), []);

                collapseHeuristic(checklists, newState.activities);
            }

            return newState;
        });
    }

    /**s
     * Render the main checklists panel (only when there is at least one activity with checklist)
     *
     * @returns {*}
     */
    render() {
        const { activities, filteredActivity, filteredEquipment } = this.state;

        // makes a global equipments array, with all the different equipments from all activities
        const equipments = activities.reduce((prev, activity) => {
            Object.keys(activity.equipments).forEach(key => prev[key] = activity.equipments[key]);
            return prev;
        }, {});

        const filteredActivities =
            activities.filter(activity => (activity.checklists && activity.checklists.length > 0));

        const filteredActivityObject = activities.find(activity => activity.activityCode === filteredActivity);

        const divStyle = {width: "100%"};
        if (this.props.readonly) {
            divStyle.pointerEvents = 'none';
        }
        if (filteredActivities.length === 0) {
            return <div/>
        } else {
            return (
                <EISPanel heading={this.props.title}
                          detailsStyle={this.expansionDetailsStyle}
                          link={this.props.printingChecklistLinkToAIS ? (this.props.printingChecklistLinkToAIS + this.props.workorder) : undefined}
                          linkIcon="fa fa-print">
                    <div style={divStyle}>
                        <div style={{paddingLeft: 25, paddingRight: 25}}>
                            {activities.length > 1 && <EAMSelect
                                children={null}
                                label={"Activity"}
                                values={[{code: null, desc: "\u200B"}, ...filteredActivities
                                    .filter(activity => filteredEquipment ? activity.equipments[filteredEquipment] !== undefined : true)
                                    .map(activity => 
                                        ({code: activity.activityCode, desc: activity.activityCode + " - " + activity.activityNote}))]}
                                value={filteredActivity ? filteredActivity : undefined}
                                onChange={obj => this.setNewFilter({activity: obj})}
                                menuContainerStyle={{'zIndex': 999}}/>}
                            {Object.keys(equipments).length > 1 && <EAMSelect
                                children={null}
                                label={"Equipment"}
                                values={[{code: null, desc: "\u200B"}, ...Object.keys(equipments)
                                    .filter(key => filteredActivity ? filteredActivityObject.equipments[key] !== undefined : true)
                                    .map(key => equipments[key])
                                    .map(equipment => (
                                        {...equipment, desc: equipment.code + " (" + equipment.desc + ")"}))]}
                                value={filteredEquipment ? filteredEquipment : undefined}
                                onChange={obj => this.setNewFilter({equipment: obj})}
                                menuContainerStyle={{'zIndex': 999}}/>}
                        </div>
                        {this.renderActivities(filteredActivity, filteredEquipment)}
                    </div>
                </EISPanel>
            )
        }
    }
}

Checklists.defaultProps = {
    title: 'CHECKLISTS',
    getWorkOrderActivities: WSChecklists.getWorkOrderActivities,
    updateChecklistItem: WSChecklists.updateChecklistItem,
    readonly: false,
    minFindingsDropdown: 3,
    collapseHeuristic: (checklists, activities) => {
        // if there are less than 100 checklists, do not collapse anything
        if(checklists.length < 100)
            return;
        
        // otherwise, collapse every activity and every equipment within each activity
        activities.forEach(activity => {
            activity.collapse();
            Object.values(activity.equipments).forEach(equipment => equipment.collapse());
        });
    }
};

const styles = {
    before: {
        boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.03), 0px 1px 3px 0px rgba(0,0,0,0.03)",
        '&::before': {
            backgroundColor: "rgba(0, 0, 0, 0.05)"
        }
    },
};

export default withStyles(styles)(Checklists);