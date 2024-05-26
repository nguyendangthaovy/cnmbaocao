var myHeaders = new Headers();
myHeaders.append('apikey', 'xQlNZ80DXV0QMX4PBFxuKhom0BWlPgP7');

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders,
};

export const checkPhone = (number) => {
    let valid = false;
    fetch('https://api.apilayer.com/number_verification/validate?number={number}', requestOptions)
        .then((response) => (valid = response.json().valid))
        .then((result) => console.log(result))
        .catch((error) => {
            console.log('error', error);
            valid = true;
        });
    return valid;
};
