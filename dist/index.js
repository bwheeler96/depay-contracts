'use strict';

var json = {
    deployed: [{
        abi: [{
            constant: false,
            inputs: [{
                name: 'recipient',
                type: 'address'
            }],
            name: 'withdrawDonations',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            constant: false,
            inputs: [{
                name: 'recipient',
                type: 'address'
            }, {
                name: 'donation',
                type: 'uint256'
            }],
            name: 'pay',
            outputs: [],
            payable: true,
            stateMutability: 'payable',
            type: 'function'
        }, {
            constant: true,
            inputs: [],
            name: 'developer',
            outputs: [{
                name: '',
                type: 'address'
            }],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        }, {
            constant: true,
            inputs: [],
            name: 'donations',
            outputs: [{
                name: '',
                type: 'uint256'
            }],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'constructor'
        }, {
            anonymous: false,
            inputs: [{
                indexed: true,
                name: 'sender',
                type: 'address'
            }, {
                indexed: true,
                name: 'receiver',
                type: 'address'
            }, {
                indexed: true,
                name: 'amount',
                type: 'uint256'
            }, {
                indexed: false,
                name: 'donation',
                type: 'uint256'
            }],
            name: 'Payment',
            type: 'event'
        }],
        address: '0xe34443095f78099675b165f07559e9b48450c77e',
        name: 'Depay'
    }],
    events: {
        '0x10258bfd896826cf69e885380049b1d1be0424a813d5117744373ec9f51bc86c': {
            anonymous: false,
            inputs: [{
                indexed: true,
                name: 'sender',
                type: 'address'
            }, {
                indexed: true,
                name: 'receiver',
                type: 'address'
            }, {
                indexed: true,
                name: 'amount',
                type: 'uint256'
            }, {
                indexed: false,
                name: 'donation',
                type: 'uint256'
            }],
            name: 'Payment',
            type: 'event'
        }
    }
};

module.exports = function (web3) {

    if (/^1/.test(web3.version.api)) {
        throw new Error('You are using web3 1.x.x. This package only supports web3 0.20.2');
    }

    var output = {};

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = json.deployed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var data = _step.value;

            var contract = web3.eth.contract(data.abi);

            if (data.address !== null) {
                contract = contract.at(data.address);
                _promisifyContract(contract);
            } else {
                (function () {
                    var orig = contract.at.bind(contract);
                    contract.at = function (address) {
                        var k = orig(address);
                        _promisifyContract(k);
                        return k;
                    };
                })();
            }

            output[data.name] = contract;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    output.eventUtils = {
        parseLogs: function parseLogs(receipt) {
            var mapped = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = receipt.logs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var log = _step2.value;

                    var event = json.events[log.topics[0]];
                    if (!event) continue;
                    event.args = output.eventUtils.parseIndexedTopics(log.topics);
                    mapped.push(event);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return mapped;
        },
        parseIndexedTopics: function parseIndexedTopics(topics) {
            var event = json.events[topics[0]];

            var indexedAttributes = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = event.inputs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var input = _step3.value;

                    if (input.indexed) {
                        indexedAttributes.push(input);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var parsed = {};
            var args = topics.slice(1);
            for (var i = 0; i < args.length; i++) {
                var topic = args[i];
                var attribute = indexedAttributes[i];

                var value = void 0;
                if (/uint/.test(attribute.type)) {
                    value = web3.toBigNumber(topic).toPrecision();
                } else if (attribute.type == 'address') {
                    value = '0x' + topic.slice(66 - 40);
                } else {
                    value = topic;
                }
                parsed[attribute.name] = value;
            }
            return parsed;
        }
    };

    output.events = json.events;

    return output;
};

function _promisifyContract(contract) {
    var _loop = function _loop(method) {
        var origName = method.name + 'Orig';
        contract[origName] = contract[method.name];
        contract[method.name] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (typeof args[args.length - 1] === 'function') {
                return contract[origName].apply(contract, args);
            } else {
                return new Promise(function (resolve, reject) {
                    contract[origName].apply(contract, args.concat([function (err, data) {
                        if (err) reject(err);else resolve(data);
                    }]));
                });
            }
        };

        contract[method.name].call = function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if (typeof args[args.length - 1] === 'function') {
                var _contract$origName;

                return (_contract$origName = contract[origName]).call.apply(_contract$origName, args);
            } else {
                return new Promise(function (resolve, reject) {
                    var _contract$origName2;

                    (_contract$origName2 = contract[origName]).call.apply(_contract$origName2, args.concat([function (err, data) {
                        if (err) reject(err);else resolve(data);
                    }]));
                });
            }
        };
    };

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = contract.abi[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var method = _step4.value;

            _loop(method);
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }
}