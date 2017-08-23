//Coaches Profile
export const fetchCoaches = () => {
  return dispatch => {
    dispatch(requestCoaches());
    const coachesRef = firebaseRef.child('coaches');
    coachesRef.once('value').then(snapshot => {
      const coaches = snapshot.val();
      var parsedCoaches = {};

      Object.keys(coaches).forEach(coachId => {
        parsedCoaches[coachId] = coaches[coachId];
      });
      dispatch(addCoaches(parsedCoaches));
      dispatch(receivedCoaches());
    });
  };
};

export const requestCoaches = () => ({
  type: 'REQUEST_COACHES'
});

export const receivedCoaches = () => ({
  type: 'RECEIVED_COACHES'
});

export const addCoaches = coaches => ({
  type: 'ADD_COACHES',
  coaches
});

export const addCoach = coach => {
  const coachesRef = firebaseRef.child('coaches');
  const newKey = coachesRef.push().key;
  let updates = {};
  updates[newKey] = coach;
  coachesRef.update(updates);
  coach.key = newKey;
  return {
    type: 'ADD_COACH',
    coach
  };
};

export const updateCoach = (coachId, coach) => {
  let updates = {};
  updates['/coaches/' + coachId] = coach;
  firebase.database().ref().update(updates);
  return {
    type: 'UPDATE_COACH',
    coachId,
    coach
  };
};

export const deleteCoach = coachId => {
  const coachesRef = firebaseRef.child('coaches/' + coachId);
  coachesRef.remove();
  return {
    type: 'DELETE_COACH',
    coachId
  };
};
