import { all, put, call, takeLatest, fork } from 'redux-saga/effects';
import axios from 'axios'
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, 
        SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, 
        LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
        LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, 
        FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE, 
        UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_SUCCESS, UNFOLLOW_USER_FAILURE, 
        LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE, 
        LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWINGS_FAILURE, 
        REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE, 
        EDIT_NICKNAME_REQUEST, EDIT_NICKNAME_SUCCESS, EDIT_NICKNAME_FAILURE } from '../reducers/user';


function loginAPI(loginData) {
    return axios.post('/user/login', loginData, {
        withCredentials: true,
    });
}

function* login(action){
    try{
        const result = yield call(loginAPI, action.data);
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
        })
    }catch(err){
        console.error(err)
        yield put({
            type: LOG_IN_FAILURE,
            reason: err.response && err.response.data,
        })
    }
}

function* watchLogin(){
    yield takeLatest(LOG_IN_REQUEST, login)
    
}

function signupAPI(signUpData){
    return axios.post('/user', signUpData);
}

function* signup(action){
    try{
        yield call(signupAPI, action.data);
        yield put({
            type: SIGN_UP_SUCCESS,
        })
    }catch(err){
        console.error(err)
        yield put({
            type: SIGN_UP_FAILURE,
            error: err,
        })
    }
   
}

function* watchSignup(){
    yield takeLatest(SIGN_UP_REQUEST, signup)
}

function logoutAPI() {
    return axios.post('/user/logout', {}, {
        withCredentials: true,
    })
}

function* logout(){
    try{
        yield call(logoutAPI);
        yield put({
            type: LOG_OUT_SUCCESS,
        })
    }catch(err){
        console.error(err);
        yield put({
            type: LOG_OUT_FAILURE,
            error: err,
        })
    }
}

function* watchLogout(){
    yield takeLatest(LOG_OUT_REQUEST, logout)
}

function loadUserAPI(userId){
    return axios.get(userId? `/user/${userId}`: `/user`, {
        withCredentials: true,
    })
}

function* loadUser(action){
    try{
        const result = yield call(loadUserAPI, action.data);
        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
            me: !action.data,
        })
    }catch(err){
        console.error(err);
        yield put({
            type: LOAD_USER_FAILURE,
            error: err,
        })
    }
}

function* watchLoadUser(){
    yield takeLatest(LOAD_USER_REQUEST, loadUser)
}

function followUserAPI(postUserId){
    return axios.post(`/user/${postUserId}/follow`, {}, {
        withCredentials: true,
    })
}

function* followUser(action){
    try{
        const result = yield call(followUserAPI, action.data);
        yield put({
            type: FOLLOW_USER_SUCCESS,
            data: result.data,
        })
    }catch(e){
        console.error(e);
        yield put({
            type: FOLLOW_USER_FAILURE,
            error: e,
        })
    }
}

function* watchFollowUser(){
    yield takeLatest(FOLLOW_USER_REQUEST, followUser);
}

function unfollowUserAPI(postUserId){
    return axios.delete(`/user/${postUserId}/follow`,{
        withCredentials: true,
    });
}

function* unfollowUser(action){
    try{
        const result = yield call(unfollowUserAPI, action.data);
        yield put({
            type: UNFOLLOW_USER_SUCCESS,
            data: result.data,
        })
    }catch(e){
        console.error(e),
        yield put({
            type: UNFOLLOW_USER_FAILURE,
            error: e,
        })
    }
}

function* watchUnfollowUser(){
    yield takeLatest(UNFOLLOW_USER_REQUEST, unfollowUser);
}

function loadFollowersAPI(userId, offset=0, limit=3){
    return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`, {
        withCredentials: true,
    });
}

function* loadFollowers(action){
    try{
        const result = yield call(loadFollowersAPI, action.data, action.offset);
        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data,
        })
    }catch(e){
        console.error(e);
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: e,
        })
    }
}

function* watchLoadFollowers(){
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function loadFollowingsAPI(userId, offset=0, limit=3){
    return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`, {
        withCredentials: true,
    });
}

function* loadFollowings(action){
    try{
        const result = yield call(loadFollowingsAPI, action.data, action.offset);
        yield put({
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data,
        })
    }catch(e){
        console.error(e),
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: e,
        })
    }
}

function* watchLoadFollowings(){
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function removeFollowerAPI(userId){
    return axios.delete(`/user/${userId}/follower`, {
        withCredentials: true,
    });
}

function* removeFollower(action){
    try{
        const result = yield call(removeFollowerAPI, action.data);
        yield put({
            type: REMOVE_FOLLOWER_SUCCESS,
            data: result.data,
        })
    }catch(e){
        console.error(e),
        yield put({
            type: REMOVE_FOLLOWER_FAILURE,
            error: e,
        })
    }
}

function* watchRemoveFollower(){
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function editNicknameAPI(nickname){
    return axios.patch(`/user/nickname`, {nickname}, {
        withCredentials: true,
    })
}

function* editNickname(action){
    try{
        const result = yield call(editNicknameAPI, action.data);
        yield put({
            type: EDIT_NICKNAME_SUCCESS,
            data: result.data,
        })
    }catch(e){
        console.error(e);
        yield put({
            type: EDIT_NICKNAME_FAILURE,
            error: e,
        })
    }
}

function* watchEditNickname(){
    yield takeLatest(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogout),
        fork(watchSignup),
        fork(watchLoadUser),
        fork(watchFollowUser),
        fork(watchUnfollowUser),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchRemoveFollower),
        fork(watchEditNickname),
    ])
}