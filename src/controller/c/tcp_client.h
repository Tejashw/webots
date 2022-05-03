/*
 * Copyright 1996-2022 Cyberbotics Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef TCP_CLIENT
#define TCP_CLIENT

int tcp_client_open();
int tcp_client_connect(int fd, const char *host, int port);
int tcp_client_send(int fd, const char *buffer, int size);
int tcp_client_receive(int fd, char *buffer, int size);
void tcp_client_close(int fd);

#endif  // TCP_CLIENT
