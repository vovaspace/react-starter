import gitBranchIs from 'git-branch-is';
import log from 'fancy-log';
import color from 'ansi-colors';

gitBranchIs('master').then(
  (result) => {
    if (result) {
      log.error(`🌶  You are trying to commit to the '${color.cyan('master')}' branch!`);
      log.error('   Don\'t do that!');
      process.exit(1);
    }
    log('👌 Preventing master commit is OK :)');
    process.exit(0);
  },
  (err) => { log.error(err); process.exit(1); }
);
