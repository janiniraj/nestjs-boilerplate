import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cls from 'cls-hooked';
import * as uniqid from 'uniqid';

import { EMM_NAMESPACE, REQUEST_ID } from '../constants';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  static createDefault() {
    return (
      cls.getNamespace(EMM_NAMESPACE) || cls.createNamespace(EMM_NAMESPACE)
    );
  }

  static get(key: string) {
    const session = cls.getNamespace(EMM_NAMESPACE);
    if (!session) {
      return null;
    }

    return session.get(key);
  }

  static set(key: string, value: any) {
    const session = cls.getNamespace(EMM_NAMESPACE);
    if (!session) {
      return null;
    }

    session.set(key, value);
  }

  resolve() {
    return (req, res, next) => {
      const session = SessionMiddleware.createDefault();

      session.run(async () => {
        SessionMiddleware.set(REQUEST_ID, uniqid());
        next();
      });
    };
  }
}
