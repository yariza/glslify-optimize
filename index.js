var optimize  = require('./optimize')

module.exports = transform

function debug(){}
if (process.env.DEBUG === 'glslify-optimize') {
  debug = console.error
}

function transform(filename, src, options, nextPostTransform) {

  function err(reason) {
    nextPostTransform(reason, null);
  }

  function out(compiled) {
    nextPostTransform(null, compiled);
  }

  if (src.indexOf('GLSLIFY') === -1) {
    return out(src);
  }

  debug('Original source:');
  debug('\n' + src);

  var opti;
  try {
    if(src.indexOf('gl_FragColor') !== -1){
      opti = optimize.frag(src);
      debug('Optimized fragment shader:')
      debug('\n' + opti)
      return out(opti);
    }
    else if(src.indexOf('gl_Position') !== -1){
      opti = optimize.vert(src);
      debug('Optimized vertex shader:')
      debug('\n' + opti)
      return out(opti);
    }
    else {
      return out(src);
    }
  } catch (e) {
    console.error('\x1b[31m', e);
    return out(src);
  }
}
