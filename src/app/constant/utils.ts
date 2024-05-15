export class utils {
  public static getConvertedDateTime(date: any) {
    if (date instanceof Date) {
      return date;
    }

    const split = date.split('T');

    if (split.length === 2) {
      const dp = split[0].split('-');
      const tp = split[1].split(':');
      if (dp.length === 3 && tp.length > 1) {
        return new Date(
          Number(dp[0]),
          Number(dp[1]) - 1,
          Number(dp[2]),
          Number(tp[0]),
          Number(tp[1])
        ).toLocaleString();
      }
    }
    return new Date(date).toLocaleString();
  }

  public static getConvertedToDateOnly(date: any) {
    if (date instanceof Date) {
      return date;
    }

    const split = date.split('T');

    if (split.length === 2) {
      const dp = split[0].split('-');

      if (dp.length === 3) {
        return new Date(Number(dp[0]), Number(dp[1]) - 1, Number(dp[2]));
      }
    } else {
      const dp = date.split('-');

      if (dp.length === 3) {
        return new Date(Number(dp[0]), Number(dp[1]) - 1, Number(dp[2]));
      }
    }
    return new Date(date);
  }

  public static getConvertedDate(date: any) {
    if (date instanceof Date) {
      return date;
    }

    const split = date.split('T');

    if (split.length === 2) {
      const dp = split[0].split('-');

      if (dp.length === 3) {
        return new Date(Number(dp[0]), Number(dp[1]) - 1, Number(dp[2]));
      }
    } else {
      const dp = date.split('-');

      if (dp.length === 3) {
        return new Date(Number(dp[0]), Number(dp[1]) - 1, Number(dp[2]));
      }
    }
    return this.getConvertedDateToISO(new Date(date));
  }

  public static getConvertedDateToISO(date: Date) {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      '-' +
      date.getDate().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    );
  }
}
