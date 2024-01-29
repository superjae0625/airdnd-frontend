import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";

// axios is a adapter of fetch

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    withCredentials: true,
});

// Fetching code in this file and separting fetching code and component

export const getRooms = () =>
    instance.get("rooms/").then((response) => response.data);

// Not sending variable directly, put them in key array
// and then it goes to getRoom Query function and saved in queryKey and it becomes an array.
// Ignore first item and use second item, roomPk
export const getRoom = ({ queryKey }: QueryFunctionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, roomPk] = queryKey;
    // first element "_" is "rooms", and second is pk
    return instance.get(`rooms/${roomPk}`).then((response) => response.data);
};

export const getRoomReviews = ({ queryKey }: QueryFunctionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, roomPk] = queryKey;
    return instance
        .get(`rooms/${roomPk}/reviews`)
        .then((response) => response.data);
};

export const getMe = () =>
    instance.get(`users/me`).then((response) => response.data);

export const logOut = () =>
    instance
        //second parameter is the data you want to send(null)
        //sending toekn that is in the cookie within headers during POST request
        .post(`users/log-out`, null, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);

export const githubLogIn = (code: string) =>
    instance
        .post(
            `/users/github`,
            { code },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.status);

export const kakaoLogin = (code: string) =>
    instance
        .post(
            `/users/kakao`,
            { code },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.status);

export interface IUsernameLoginVariables {
    username: string;
    password: string;
}
export interface IUsernameLoginSuccess {
    ok: string;
}
export interface IUsernameLoginError {
    error: string;
}

export const usernameLogIn = ({
    username,
    password,
}: IUsernameLoginVariables) =>
    instance.post(
        `/users/log-in`,
        { username, password },
        {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        }
    );

interface ISignUpVariables {
    name: string;
    email: string;
    username: string;
    password: string;
    currency: string;
    gender: string;
    language: string;
}

export const SignUp = ({
    username,
    password,
    email,
    name,
    currency,
    gender,
    language,
}: ISignUpVariables) =>
    instance
        .post(
            `users/`,
            { username, password, email, name, currency, gender, language },
            {
                headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" },
            }
        )
        .then((response) => response.data);

export const getAmenities = () =>
    instance.get(`rooms/amenities`).then((response) => response.data);

export const getCategories = () =>
    instance.get(`categories`).then((response) => response.data);

export interface IUploadRoomVariables {
    name: string;
    country: string;
    city: string;
    price: number;
    rooms: number;
    toilets: number;
    description: string;
    address: string;
    pet_friendly: boolean;
    kind: string;
    amenities: number[];
    category: number;
}

export const uploadRoom = (variables: IUploadRoomVariables) =>
    instance
        .post(`rooms/`, variables, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);

export const getUploadURL = () =>
    instance
        .post(`medias/photos/get-url`, null, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);

export interface IUploadImageVarialbes {
    file: FileList;
    uploadURL: string;
}

// using {} to make the first parameter of the function
export const uploadImage = ({ file, uploadURL }: IUploadImageVarialbes) => {
    const form = new FormData();
    form.append("file", file[0]);
    return axios
        .post(uploadURL, form, {
            headers: {
                "Content-Type": "multipart/form-data",
                //this tells we are uploading data type: file
            },
        })
        .then((response) => response.data);
};

export interface ICreatePhotoVariables {
    description: string;
    file: string;
    roomPk: string;
}

export const createPhoto = ({
    description,
    file,
    roomPk,
}: ICreatePhotoVariables) =>
    instance
        .post(
            `rooms/${roomPk}/photos`,
            { description, file },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.data);
