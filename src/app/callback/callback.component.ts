import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  screen_name: any;
  tweetText: any;
  tweetedData: any;
  tweetDataTemp: boolean = false;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const oauthToken = params['oauth_token'];
      const oauthVerifier = params['oauth_verifier'];
      this.saveAccessToken(oauthToken, oauthVerifier);
    });

    setTimeout(() => {
      this.http.get('http://localhost:3010/tweet/gettweets?user_id=' + sessionStorage.getItem('user_id'))
        .subscribe((tweetLists: any) => {
          this.tweetedData = JSON.parse(tweetLists[0].data);
          console.log("get tweets successfully parsed data >>", this.tweetedData);

          if (this.tweetedData.length == []) {
            this.tweetDataTemp = false;
          } else {
            this.tweetDataTemp = true;
          }
        },
          error => {
            console.log("get tweets failed >>", error);
            alert('Tweets fetching failed - ' + error.error.msg);
          })
    }, 3000);

    setTimeout(() => {
      this.screen_name = sessionStorage.getItem('screen_name');
    }, 3000);
  }

  saveAccessToken(oauthToken: string, oauthVerifier: string) {
    this.http.get('http://localhost:3010/twitter/saveaccesstokens?oauth_token=' + oauthToken + '&oauth_verifier=' + oauthVerifier)
      .subscribe((accessToken: any) => {
        console.log("accessToken sent successfully >>", accessToken.msg);
        const tokenValidateData = jwt_decode(accessToken.token);

        sessionStorage.setItem('jwt', accessToken.token);
        sessionStorage.setItem('screen_name', tokenValidateData.screen_name);
        sessionStorage.setItem('user_id', tokenValidateData.user_id);
      },
        error => {
          console.log("accessToken failed >>", error);
        })
  }

  tweetFunc() {
    this.tweetText = (<HTMLInputElement>document.getElementById('tweet-textarea')).value;
  }

  tweet() {
    this.http.post('http://localhost:3010/tweet/posttweet', {
      tweetText: this.tweetText,
      screen_name: sessionStorage.getItem('screen_name'),
      user_id: sessionStorage.getItem('user_id'),
    })
      .subscribe((tweet: any) => {
        console.log("tweet sent successfully >>", tweet);
        alert('Tweeted successfully');
      },
        error => {
          console.log("tweet failed >>", error);
          alert('Tweet failed - ' + error.error.msg);
        })
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}