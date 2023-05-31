import updatePicture from './updatePicture';
import applyNodeProps from './applyNodeProps';
import { KonvaComponent } from '../interfaces/ko-component.interface';

function camelize(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '');
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getName(componentTag: string): string {
  return capitalizeFirstLetter(
    camelize(componentTag.slice(3).replace('-', ' '))
  );
}

export function createListener(
  instance: KonvaComponent
): Record<string, (value?: unknown) => void> {
  const output = {};
  [
    'click',
    'dblclick',
    'mouseover',
    'mouseout',
    'mousemove',
    'tap',
    'dbltap',
    'touchstart',
    'scaleXChange',
    'fillChange',
    'dragstart',
    'dragmove',
    'dragend',
  ].forEach((eventName: keyof KonvaComponent) => {
    if (instance[eventName].observers.length) {
      output['on' + eventName] = instance[eventName].emit.bind(
        instance[eventName]
      );
    }
  });
  return output;
}

export { updatePicture, applyNodeProps };
