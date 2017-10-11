import firebase, { firebaseRef } from 'firebaseApp';
//Coaches Profile
export const startCoaches = () => {
  return dispatch => {
    const coachesRef = firebaseRef.child('coaches');
    coachesRef.once('value').then(snapshot => {
      const coaches = snapshot.val();
      var parsedCoaches = [];
      Object.keys(coaches).forEach(coachId => {
        parsedCoaches.push({ key: coachId, ...coaches[coachId] });
      });
      dispatch(addCoaches(parsedCoaches));
    });
  };
};

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
