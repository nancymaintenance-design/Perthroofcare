export function assessLlmsResponses(responses, candidate) {
 const independentOfAcceptLanguage=responses[0]===responses[1]&&typeof responses[0]==='string';
 const candidatePublished=responses.every(body=>body===candidate);
 const issues=independentOfAcceptLanguage?[]:['Root llms.txt differs by Accept-Language or its response is unverified'];
 const publicationStatus=candidatePublished?'candidate is published':'candidate is not published';
 return {independentOfAcceptLanguage,candidatePublished,issues,publicationStatus};
}
