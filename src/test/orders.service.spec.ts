"use strict";

describe("ordersService", () => {
    const api = "/api/orders";

    let $httpBackend,
        sessionService,
        ordersService;

    beforeEach(angular.mock.module("components"));

    beforeEach(inject($injector => {
        const environment = "my environment",
            token = "my token",
            accountId = "my account id";

        $httpBackend = $injector.get("$httpBackend");
        ordersService = $injector.get("ordersService");
        sessionService = $injector.get("sessionService");

        sessionService.setCredentials({
            environment,
            token,
            accountId
        });

        $httpBackend
            .when("POST", api)
            .respond([
                {
                    expiry: "2014-02-15T16:22:07Z",
                    id: 175427639,
                    instrument: "EUR_USD",
                    lowerBound: 0,
                    price: 1,
                    side: "buy",
                    stopLoss: 0,
                    takeProfit: 0,
                    time: "2014-02-11T16:22:07Z",
                    trailingStop: 0,
                    type: "marketIfTouched",
                    units: 20,
                    upperBound: 0
                },
                {
                    expiry: "2014-02-12T16:22:07Z",
                    id: 175427637,
                    instrument: "EUR_USD",
                    lowerBound: 0,
                    price: 1,
                    side: "sell",
                    stopLoss: 0,
                    takeProfit: 0,
                    time: "2014-02-11T16:22:07Z",
                    trailingStop: 0,
                    type: "marketIfTouched",
                    units: 10,
                    upperBound: 0
                }
            ]);

        $httpBackend.whenGET(/^app\/.*\.html$/).respond(200);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("refresh", () => {
        it("test", () => {
            ordersService.refresh();
            $httpBackend.flush();

            const orders = ordersService.getOrders();

            const assert = chai.assert;

            assert.lengthOf(orders, 2);

            assert.equal(175427637, orders[1].id);
            assert.equal("EUR_USD", orders[1].instrument);
            assert.equal(10, orders[1].units);
            assert.equal("sell", orders[1].side);
            assert.equal("marketIfTouched", orders[1].type);
            assert.equal("2014-02-11T16:22:07Z", orders[1].time);
            assert.equal(1, orders[1].price);
            assert.equal(0, orders[1].takeProfit);
            assert.equal(0, orders[1].stopLoss);
            assert.equal("2014-02-12T16:22:07Z", orders[1].expiry);
            assert.equal(0, orders[1].takeProfit);
            assert.equal(0, orders[1].upperBound);
            assert.equal(0, orders[1].lowerBound);
            assert.equal(0, orders[1].trailingStop);
        });
    });
});
