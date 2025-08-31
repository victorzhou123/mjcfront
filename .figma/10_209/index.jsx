import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.setting}>
      <div className={styles.frame551}>
        <img src="../image/mezlbkxp-3t2qcyv.svg" className={styles.chevronLeft} />
      </div>
      <div className={styles.frame555}>
        <div className={styles.frame552}>
          <div className={styles.frame577}>
            <p className={styles.text}>订阅会员</p>
            <img
              src="../image/mezlbkxp-tncihyt.svg"
              className={styles.chevronLeft}
            />
          </div>
          <img
            src="../image/mezlbkxp-tc5iktt.svg"
            className={styles.arrowRightSLine1}
          />
        </div>
      </div>
      <div className={styles.frame556}>
        <div className={styles.frame553}>
          <p className={styles.text2}>用户协议</p>
          <img
            src="../image/mezlbkxp-tc5iktt.svg"
            className={styles.arrowRightSLine1}
          />
        </div>
      </div>
      <div className={styles.frame556}>
        <div className={styles.frame553}>
          <p className={styles.text2}>隐私政策</p>
          <img
            src="../image/mezlbkxp-tc5iktt.svg"
            className={styles.arrowRightSLine1}
          />
        </div>
      </div>
    </div>
  );
}

export default Component;
