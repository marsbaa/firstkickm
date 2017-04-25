
module.exports = {
  filter: function (students, centreId, searchText) {
    var filteredStudents = students;

    // Filter by centreId
    filteredStudents = filteredStudents.filter((student) => {
      return student.venueId.toString() === centreId.toString();
    });


    //Filter by searchText
    filteredStudents = filteredStudents.filter((student) => {
      var text = student.childName.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) !== -1;
    });

    return filteredStudents;
  }
};
