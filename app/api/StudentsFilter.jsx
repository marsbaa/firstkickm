
module.exports = {
  filter: function (students, centreId, searchText) {
    var filteredStudents = students;

    // Filter by centreId
    filteredStudents = filteredStudents.filter((student) => {
      if (student.venueId !== undefined){
        return student.venueId.toString() === centreId;
      }
      else {
        return student.venueId === centreId
      }

    });


    //Filter by searchText
    filteredStudents = filteredStudents.filter((student) => {
      var text = student.childName.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) !== -1;
    });

    return filteredStudents;
  }
};
