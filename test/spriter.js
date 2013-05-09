var spriter = require('..'),
    fs = require('fs'),
    Canvas = require('canvas');

var fixturePath = 'test/fixtures/';
var targetPath = 'images/generated/sprites/';

function fixture(name) {
    return fs.readFileSync(fixturePath + name + '.css', 'utf8');
}

function imageData(filename) {
    var image = new Canvas.Image();
    image.src = filename;

    var canvas = new Canvas(image.width, image.height);
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);

    return context.getImageData(0, 0, image.width, image.height).data;
}

function diff(a, b) {
    var dataA = imageData(a);
    var dataB = imageData(b);

    if (dataA.length != dataB.length) return true;

    for (var i = 0; i < dataA.length; i++) {
        if (dataA[i] != dataB[i]) {
            return true;
        }
    }

    return false;
}

describe('spriter', function() {
    it('should generate sprite sheet with optimization', function() {
        spriter(fixture('simple'), fixturePath, targetPath + 'simple.png', null, true).should.equal(fixture('simple.out'));

        diff(fixturePath + targetPath + 'simple.png', fixturePath + 'simple.out.png').should.be.false;
    });

    it('should generate sprite sheet without optimization', function() {
        spriter(fixture('no-optimization'), fixturePath, targetPath + 'no-optimization.png').should.equal(fixture('no-optimization.out'));

        diff(fixturePath + targetPath + 'no-optimization.png', fixturePath + 'no-optimization.out.png').should.be.false;
    });

    it('should inline sprites with optimization', function() {
        spriter(fixture('inline'), fixturePath, targetPath + 'simple.png', null, true, true).should.equal(fixture('inline.out'));
    });

    it('should not read filtered declarations', function() {
        spriter(fixture('filtered'), fixturePath, targetPath + 'filtered.png', 'sprites/', true).should.equal(fixture('filtered.out'));

        diff(fixturePath + targetPath + 'filtered.png', fixturePath + 'filtered.out.png').should.be.false;
    });

    it('should read declarations within media queries', function() {
        spriter(fixture('media-query'), fixturePath, targetPath + 'media-query.png', null, true).should.equal(fixture('media-query.out'));

        diff(fixturePath + targetPath + 'media-query.png', fixturePath + 'media-query.out.png').should.be.false;
    });

    it('should group sprites by suffix', function() {
        spriter(fixture('suffix'), fixturePath, targetPath + 'suffix.png', null, true).should.equal(fixture('suffix.out'));

        diff(fixturePath + targetPath + 'suffix.png', fixturePath + 'suffix.out.png').should.be.false;
        diff(fixturePath + targetPath + 'suffix@2x.png', fixturePath + 'suffix.out@2x.png').should.be.false;
    });

    it('should add duplicate images to sprite sheet', function() {
        spriter(fixture('duplicate'), fixturePath, targetPath + 'duplicate.png', null, true).should.equal(fixture('duplicate.out'));

        diff(fixturePath + targetPath + 'duplicate.png', fixturePath + 'duplicate.out.png').should.be.false;
    });

    it('should handle empty rules and declarations', function() {
        spriter(fixture('empty'), fixturePath, targetPath + 'empty.png', null, true).should.equal(fixture('empty.out'));
    });
});
