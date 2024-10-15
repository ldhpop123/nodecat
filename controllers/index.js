const axios = require('axios');
// HTTP 요청을 쉽게 보내기 위한 axios 모듈을 불러옴

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;

const request = async (req, res) => {
    try {
        if (!req.session.jwt) { // 세션에 jwt가 없으면 
            const tokenResult = await axios.post(`${URL}/token`, { // 새로운 토큰 요청
                clientSecret: process.env.CLIENT_SECRET, 
            });
            req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
        }
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: req.session.jwt }, // 요청 헤더에 Jwt 포함
        });
    } catch (error) {
        if (error.response?.status === 419 ) { // 토큰 만료 시 처리
            delete req.session.jwt; // 세션에서 jwt 삭제
            return request(req, api); // 새로운 토큰 요청 후 재시도
        }
        throw error; // 419 외의 다른 에러이면 에러 발생
    }
};

exports.getMyPosts = async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.searchByHashtag = async (req, res, next) => {
    try {
        const result = await request (
            req, `/post/hashtag/${encodeURIComponent(req.params.hashtag)}`,
        );
        res.json(result.data)
    } catch (error) {
        if (error.code) {
            console.error(error);
            next(error);
        }
    }
}
