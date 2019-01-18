import { Test } from '@nestjs/testing';
import { EmailerService } from './emailer.service';
import { fakeWord, fakeEmail } from 'src/common/testing/fakes';

describe('EmailerService', () => {
  let emailerService: EmailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EmailerService]
    }).compile();

    emailerService = module.get<EmailerService>(EmailerService);
  });

  describe('send', () => {
    it('should send an email', async () => {
      expect(
        await emailerService.send({
          subject: fakeWord(),
          to: [fakeEmail()],
          from: fakeEmail(),
          title: fakeWord(),
          snippet: 'password-reset',
          params: { token: fakeWord() }
        })
      ).toBeTruthy();
    });
  });
});
