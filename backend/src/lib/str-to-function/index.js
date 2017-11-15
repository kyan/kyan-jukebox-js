export default function(obj, methodStr) {
  let context = obj;

  methodStr.split('.').forEach(function (mthd) {
    context = context[mthd];
  });

  return context;
};
