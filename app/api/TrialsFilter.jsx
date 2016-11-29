module.exports = {
  filter: function (trials, centreId, searchText) {
    var filteredTrials = trials;

    // Filter by centreId
    filteredTrials = filteredTrials.filter((trial) => {
      return trial.venueId === centreId;
    });

    //Filter by searchText
    filteredTrials = filteredTrials.filter((trial) => {
      var text = trial.childName.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) > -1;
    });

    // Sort trials with completed first
    filteredTrials.sort((a, b) => {
      if (a.attended && !b.attended) {
        return -1;
      } else if (!a.attended && b.attended) {
        return 1;
      } else {
        return 0;
      }
    });

    return filteredTrials;
  }
};
