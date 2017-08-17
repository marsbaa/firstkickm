module.exports = {
  filter: function(openhouse, centreName, searchText) {
    var filteredOpenhouse = openhouse;

    // Filter by centreId
    filteredOpenhouse = filteredOpenhouse.filter(openhouse => {
      return openhouse.centreName === centreName;
    });

    //Filter by searchText
    filteredOpenhouse = filteredOpenhouse.filter(openhouse => {
      var text = openhouse.childName.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) > -1;
    });
    // Sort trials with completed first
    filteredOpenhouse.sort((a, b) => {
      if (a.attended && !b.attended) {
        return -1;
      } else if (!a.attended && b.attended) {
        return 1;
      } else {
        return 0;
      }
    });

    return filteredOpenhouse;
  }
};
