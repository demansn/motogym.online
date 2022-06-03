import {Nav} from "react-bootstrap";
import {NavLink} from "./NavLink";
import {T} from "./T";

export function CompetitionNavTabs({competitionId, competitionType, hiddenAddResult }) {
    return (
        <Nav fill variant="tabs" >
            <Nav.Item>
                <NavLink href={`/competition/${competitionId}`} >
                    <T>About competition</T>
                </NavLink>
            </Nav.Item>
            <Nav.Item hidden={hiddenAddResult}>
                <NavLink href={`/competition/${competitionId}/add-result`} >
                    <T>Add result</T>
                </NavLink>
            </Nav.Item>
            <Nav.Item>
                <NavLink href={`/rules/${competitionType}`} >
                    <T>Rules</T>
                </NavLink>
            </Nav.Item>
        </Nav>
    );
}