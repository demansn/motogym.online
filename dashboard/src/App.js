import * as React from "react";
import {Admin, Resource} from 'react-admin';
import Dashboard from "./Dashboard";
import authProvider from "./authProvider";
import {Component} from "react";
import {DriversList} from "./components/DriversList";
import {DriverEdit} from "./components/DriverEdit";
import {CompetitionsList} from "./components/competition/CompetitionsList";
import CompetitionCreate from "./components/competition/CompetitionCreate";
import {createDataProvider} from "./data";
import {GRAPHQL_API} from "./configs";
import {CompetitionEdit} from "./components/competition/CompetitionEdit";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {dataProvider: null};
    }

    componentDidMount() {
        this.setState({dataProvider: createDataProvider(GRAPHQL_API)});
    }

    render() {
        const {dataProvider} = this.state;

        if (!dataProvider) {
            return <div>Loading</div>;
        }

        return (
            <Admin dataProvider={dataProvider} dashboard={Dashboard} authProvider={authProvider}>
                <Resource name="drivers" list={DriversList} edit={DriverEdit}/>
                <Resource name="competitions" list={CompetitionsList} create={CompetitionCreate} edit={CompetitionEdit} />
            </Admin>
        );
    }
}

export default App;
