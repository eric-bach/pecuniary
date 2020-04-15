import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import { Doughnut } from "react-chartjs-2";
import { fetchPositions } from "../../domain/position/actions";
import { fetchTimeSeries } from "../../domain/timeseries/actions";
import { fetchTransactions } from "../../domain/transaction/actions";

class Graph extends Component {
  componentDidMount = async () => {
    // Fetch Positions
    await this.props.fetchPositions(this.props.aggregateId);

    const typeLabels = [...new Set(this.props.positions.map(a => a.type).map(label => label))];
    var typeValues = [];
    var i = 0;
    typeLabels.forEach(t => {
      typeValues[i] = this.props.positions.filter(p => p.type === t).length;
      i++;
    });

    typesData = {
      labels: typeLabels,
      datasets: [
        {
          backgroundColor: ["#2185d0", "#db2828"],
          hoverBackgroundColor: ["#2185d0", "#db2828"],
          data: typeValues
        }
      ]
    };

    const regionLabels = [...new Set(this.props.positions.map(a => a.region).map(label => label))];
    var regionValues = [];
    var j = 0;
    regionLabels.forEach(r => {
      regionValues[j] = this.props.positions.filter(p => p.region === r).length;
      j++;
    });

    regionsData = {
      labels: regionLabels,
      datasets: [
        {
          backgroundColor: ["#2185d0", "#db2828"],
          hoverBackgroundColor: ["#2185d0", "#db2828"],
          data: regionValues
        }
      ]
    };

    // await this.props.fetchTransactions(this.props.aggregateId, null);
    // console.log("Graph.Transactions: ", this.props.transactions);
    // // Get TimeSeries
    // await this.props.transactions.map(async t => {
    //   await this.props.fetchTimeSeries(t);
    // });
    // console.log("Graph.TimeSeries: ", this.props.timeSeries);
  };

  render() {
    return (
      <div>
        <Grid>
          <Grid.Column width={2} />
          <Grid.Column width={6}>
            <Doughnut data={typesData} />
          </Grid.Column>
          <Grid.Column width={6}>
            <Doughnut data={regionsData} />
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid>
      </div>
    );
  }
}

var typesData = {};
var regionsData = {};

const mapStateToProps = state => {
  return {
    positions: state.positions.positions,
    transactions: state.transaction.transactions,
    timeSeries: state.timeSeries.timeSeries
  };
};

const actions = {
  fetchPositions,
  fetchTimeSeries,
  fetchTransactions
};

export default connect(mapStateToProps, actions)(Graph);
