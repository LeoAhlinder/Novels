const supertest = require("supertest");
const chai = require("chai");
const app = require("../server")

const jwt = require('jsonwebtoken');
const secretKey = 'leo'; 

const userId = '6'; // Replace with the user ID for testing
const mockToken = jwt.sign({ user: userId }, secretKey);



describe("getAuthToken",function(){
    it("getToken",function(done){
        supertest(app)
        .get('/api/protected/')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);

            done();
        });
    })
})

describe("GET /api/library",function(){
    it("should retrieve with users book",function(done){
        supertest(app)
            .get("/api/library")
            .set("Authorization",`${mockToken}`)
            .expect(200) 
            .end((function(err,results){
                if (err) done(err)
                done();
            }))
    })
})