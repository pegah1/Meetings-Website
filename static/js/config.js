window.config = {
  BASE_URL: 'http://localhost:8001'
};

window.config = {
  BASE_URL: config.BASE_URL,
  SIGNUP_URL: config.BASE_URL + '/user/signup',
  SIGNIN_URL: config.BASE_URL + '/user/signin',
  ACTIVECOD_URL: config.BASE_URL + '/user/activationCod',
  FORGOTPASS_URL: config.BASE_URL + '/user/forgotPassword',
  SCHEDUL_URL:  config.BASE_URL + '/user/profile/schedul',
  EMAIL_ACTIVE_ACCOUNT: config.BASE_URL + '/user/{codActive}/active/account',
  FORGOTPASS_RESETPASS: config.BASE_URL + '/user/forgotPassword/resetpass',
  EMAIL_FORGOTPASS_RESETPASS: config.BASE_URL + '/user/{resetPass}/forgotPassword/resetpass',
  CHANGE_PASS: config.BASE_URL + '/user/changepass',
  PARTICIPATE_SCHEDUL_URL: config.BASE_URL+'/{email}/{pollID}/participate',
  CREATE_POLL_URL: config.BASE_URL + '/user/createPoll',
  SHOW_POLL_URL: config.BASE_URL + '/user/showPoll',
  ADD_COMMENT_URL: config.BASE_URL + '/insert/comment',
  SAVE_POLL_URL: config.BASE_URL + '/schedul/poll',
  EDIT_POLL_URL: config.BASE_URL + '/user/edit/poll/information',
  DELETE_POLL_URL: config.BASE_URL + '/user/delete/poll',
  DELETE_COMMENT_URL: config.BASE_URL + '/delete/comment',
  DELETE_PARTICIPATE_URL: config.BASE_URL + '/delete/participate',
  IGNORE_EMAIL_URL: config.BASE_URL + '/{email}/ignore/email',
  CHANGE_USERNAME: config.BASE_URL + '/user/changeUsername',
  MYPOLLS: config.BASE_URL + '/user/{email}/{cod}/show/polls'
};

