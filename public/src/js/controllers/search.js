'use strict';

angular.module('insight.search').controller('SearchController',
  function($scope, $routeParams, $location, $timeout, Global, Block, Transaction, Address, BlockByHeight) {
  $scope.global = Global;
  $scope.loading = false;

  var _badQuery = function() {
    $scope.badQuery = true;

    $timeout(function() {
      $scope.badQuery = false;
    }, 2000);
  };

  var _resetSearch = function() {
    $scope.q = '';
    $scope.loading = false;
  };

  $scope.search = function() {
    var q = $scope.q;
    $scope.badQuery = false;
    $scope.loading = true;

    //Default order from https://github.com/vkaxevo/insight-ui/blob/master/public/src/js/controllers/search.js
    // is block, then tx, then address, then height and then fail, we do this a bit more optimized by actual usage
    Address.get({
      addrStr: q
    }, function() {
      _resetSearch();
      $location.path('address/' + q);
    }, function() {
      Transaction.get({
        txId: q
      }, function() {
        _resetSearch();
        $location.path('tx/' + q);
      }, function() { //tx not found, search on Block
        Block.get({
          blockHash: q
        }, function() {
          _resetSearch();
          $location.path('block/' + q);
        }, function() { //block not found, search on number
          if (isFinite(q)) { // ensure that q is a finite number. A logical height value.
            BlockByHeight.get({
              blockHeight: q
            }, function(hash) {
              _resetSearch();
              $location.path('/block/' + hash.blockHash);
            }, function() { //not found, fail :(
              $scope.loading = false;
              _badQuery();
            });
          }
          else {
            $scope.loading = false;
            _badQuery();
          }
        });
      });
    });
  };
});
