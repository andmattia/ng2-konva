// adapted FROM: https://github.com/lavrton/react-konva/blob/master/src/react-konva-fiber.js

import updatePicture from './updatePicture';
import { KonvaComponent } from '../interfaces/ko-component.interface';
import { KonvaEventObject, NodeConfig } from 'konva/lib/Node';
import { AngularNode } from '../interfaces/angular-node.interface';

export default function applyNodeProps<T extends NodeConfig>(
  component: KonvaComponent,
  props: T | Record<string, never> = {},
  oldProps: T | Record<string, never> = {}
): void {
  if ('id' in props) {
    const message = `ng2-konva: You are using "id" attribute for Konva node. In some very rare cases it may produce bugs. Currently we recommend not to use it and use "name" attribute instead.`;
    console.warn(message);
  }

  const instance = component.getStage();
  const updatedProps: T | Record<string, unknown> = {};
  let hasUpdates = false;

  Object.keys(oldProps).forEach((key) => {
    const isEvent = key.slice(0, 2) === 'on';
    const propChanged = oldProps[key] !== props[key];
    if (isEvent && propChanged) {
      let eventName = key.slice(2).toLowerCase();
      if (eventName.slice(0, 7) === 'content') {
        eventName =
          'content' + eventName.slice(7, 8).toUpperCase() + eventName.slice(8);
      }
      instance.shape.off(eventName, oldProps[key]);
    }
    const toRemove = !Object.hasOwn(props, key);
    if (toRemove) {
      instance.shape.setAttr(key, undefined);
    }
  });
  Object.keys(props).forEach((key) => {
    const isEvent = key.slice(0, 2) === 'on';
    const toAdd = oldProps[key] !== props[key];
    if (isEvent && toAdd) {
      let eventName = key.slice(2).toLowerCase();
      if (eventName.slice(0, 7) === 'content') {
        eventName =
          'content' + eventName.slice(7, 8).toUpperCase() + eventName.slice(8);
      }
      if (props[key]) {
        instance.shape.off(eventName);
        instance.shape.on(eventName, (evt: KonvaEventObject<unknown>) => {
          console.log(evt.target);
          props[key](
            //(evt.target as AngularNode).AngularComponent, // todo: reference needed?
            evt
          );
        });
      }
    }
    if (
      !isEvent &&
      (props[key] !== oldProps[key] ||
        props[key] !== instance.shape.getAttr(key))
    ) {
      hasUpdates = true;
      updatedProps[key] = props[key];
    }
  });

  if (hasUpdates) {
    instance.shape.setAttrs(updatedProps);
    updatePicture(instance.shape);
    let val;
    Object.keys(updatedProps).forEach((prop) => {
      val = updatedProps[prop];
      if (val instanceof Image && !val.complete) {
        const node = instance.shape;
        val.addEventListener('load', function () {
          const layer = node.getLayer();
          if (layer) {
            layer.batchDraw();
          }
        });
      }
    });
  }
}
